import { TestCase } from 'src/interface/in.interface';
import { ExecutionResult } from 'src/interface/out.interface';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

const languageConfigs: { [key: string]: { extension: string, dockerfile: string, compileCmd?: string, runCmd: string } } = {
  c: { extension: 'c', dockerfile: 'Dockerfile.c', compileCmd: 'gcc -o solution solution.c', runCmd: './solution' },
  cpp: { extension: 'cpp', dockerfile: 'Dockerfile.cpp', compileCmd: 'g++ -o solution solution.cpp', runCmd: './solution' },
  py: { extension: 'py', dockerfile: 'Dockerfile.py', runCmd: 'python3 solution.py' },
  js: { extension: 'js', dockerfile: 'Dockerfile.js', runCmd: 'node solution.js' },
  rs: { extension: 'rs', dockerfile: 'Dockerfile.rs', compileCmd: 'rustc -o solution solution.rs', runCmd: './solution' },
  java: { extension: 'java', dockerfile: 'Dockerfile.java', compileCmd: 'javac Solution.java', runCmd: 'java Solution' },
  go: { extension: 'go', dockerfile: 'Dockerfile.go', compileCmd: 'go build -o solution solution.go', runCmd: './solution' },
};

const runInSandbox = async (code: string, testCase: TestCase, language: string): Promise<ExecutionResult> => {
  const config = languageConfigs[language];
  const containerName = `judge-${Date.now()}`;
  const tmpDir = path.join('/tmp', containerName);
  const codeFile = `solution.${config.extension}`;

  try {
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(path.join(tmpDir, codeFile), code);

    // Copy Dockerfile
    const dockerfileContent = await fs.readFile(path.join(__dirname, 'docker', config.dockerfile), 'utf8');
    await fs.writeFile(path.join(tmpDir, 'Dockerfile'), dockerfileContent);

    // Build Docker image
    await execAsync(`sudo docker build -t ${containerName} ${tmpDir}`);

    // Compile the code if necessary
    if (config.compileCmd) {
      await execAsync(`sudo docker run --rm -v ${tmpDir}:/usr/src/app -w /usr/src/app ${containerName} sh -c "${config.compileCmd}"`);
    }

    // Run Docker container with the test case input and timeout
    const { stdout, stderr } = await execAsync(`echo "${testCase.input.replace(/\n/g, '\\n')}" | sudo docker run --rm --network none --memory="256m" --cpus="1" -v ${tmpDir}:/usr/src/app -w /usr/src/app ${containerName} timeout 1s sh -c "${config.runCmd}"`);

    // Compare the output with the expected output
    const output = stdout.trim();
    const success = output === testCase.expectedOutput.trim();
    return { success, output, error: stderr.trim() };
  } catch (error) {
    return { success: false, output: '', error: error.message };
  } finally {
    // Cleanup
    await execAsync(`sudo docker rmi -f ${containerName}`);
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
};

export { runInSandbox };
