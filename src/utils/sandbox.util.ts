import { exec } from 'child_process';
import { promisify } from 'util';
import { TestCase } from 'src/interface/in.interface';
import { ExecutionResult } from 'src/interface/out.interface';
import * as fs from 'fs/promises';
import * as path from 'path';
import { stdout } from 'process';

const execAsync = promisify(exec);

const languageConfigs: { [key: string]: { extension: string, dockerfile: string, compileCmd?: string, runCmd: string } } = {
    c: { extension: 'c', dockerfile: 'Dockerfile.c', compileCmd: 'gcc -o solution solution.c', runCmd: './solution' },
    cpp: { extension: 'cpp', dockerfile: 'Dockerfile.cpp', compileCmd: 'g++ -o solution solution.cpp', runCmd: './solution' },
    py: { extension: 'py', dockerfile: 'Dockerfile.py', runCmd: 'python3 solution.py' },
    js: { extension: 'js', dockerfile: 'Dockerfile.js', runCmd: 'node solution.js' },
    rs: { extension: 'rs', dockerfile: 'Dockerfile.rs', compileCmd: 'rustc -o solution solution.rs', runCmd: './solution' },
    java: { extension: 'java', dockerfile: 'Dockerfile.java', compileCmd: 'javac Solution.java', runCmd: 'java Solution' },
    kt: { extension: 'kt', dockerfile: 'Dockerfile.kt', compileCmd: 'kotlinc solution.kt -include-runtime -d solution.jar', runCmd: 'java -jar solution.jar' },
    go: { extension: 'go', dockerfile: 'Dockerfile.go', runCmd: 'go run solution.go' },
  };

  const runInSandbox = async (code: string, testCase: TestCase, language: string): Promise<ExecutionResult> => {
    const config = languageConfigs[language];
    const containerName = `judge-${Date.now()}`;
    const tmpDir = path.join('/tmp', containerName);
    const codeFile = `solution.${config.extension}`;
    
    try {
      console.log('start fs')
      await fs.mkdir(tmpDir, { recursive: true });
      await fs.writeFile(path.join(tmpDir, codeFile), code);
  
      console.log('copy dockerfile')
      // Copy Dockerfile
      const dockerfileContent = await fs.readFile(path.join(__dirname, 'docker', config.dockerfile), 'utf8');
      await fs.writeFile(path.join(tmpDir, 'Dockerfile'), dockerfileContent);
  
      console.log('build img')
      // Build Docker image
      await execAsync(`sudo docker build -t ${containerName} ${tmpDir}`);
  
      console.log('compiling')
      // Compile the code if necessary
      if (config.compileCmd) {
        await execAsync(`sudo docker run --rm -v ${tmpDir}:/usr/src/app -w /usr/src/app ${containerName} sh -c "${config.compileCmd}"`);
      }
  
      console.log('running')
      // Run Docker container with the test case input and timeout
      const { stdout, stderr } = await execAsync(`echo "${testCase.input}" | sudo docker run --rm --network none --memory="256m" --cpus="1" -v ${tmpDir}:/usr/src/app -w /usr/src/app ${containerName} timeout 5s sh -c "${config.runCmd}"`);
  
      console.log('trim1')
      // Compare the output with the expected output
      const success = stdout.trim() === testCase.expectedOutput.trim();
      console.log('trim2')
      return { success, output: stdout.trim(), error: stderr.trim() };
    } catch (error) {
      return { success: false, output: '', error: error.message };
    } finally {
      // Cleanup
      await execAsync(`sudo docker rmi -f ${containerName}`);
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  };
  

export { runInSandbox };
