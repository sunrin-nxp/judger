import { exec } from 'child_process';
import { promisify } from 'util';
import { TestCase } from 'src/interface/in.interface';
import { ExecutionResult } from 'src/interface/out.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

const languageConfigs: { [key: string]: { extension: string, dockerfile: string, runCmd: string } } = {
    c: { extension: 'c', dockerfile: 'Dockerfile.c', runCmd: 'gcc -o solution solution.c && ./solution' },
    cpp: { extension: 'cpp', dockerfile: 'Dockerfile.cpp', runCmd: 'g++ -o solution solution.cpp && ./solution' },
    py: { extension: 'py', dockerfile: 'Dockerfile.py', runCmd: 'python3 solution.py' },
    js: { extension: 'js', dockerfile: 'Dockerfile.js', runCmd: 'node solution.js' },
    rs: { extension: 'rs', dockerfile: 'Dockerfile.rs', runCmd: 'rustc -o solution solution.rs && ./solution' },
    java: { extension: 'java', dockerfile: 'Dockerfile.java', runCmd: 'javac solution.java && java solution' },
    kt: { extension: 'kt', dockerfile: 'Dockerfile.kt', runCmd: 'kotlinc solution.kt -include-runtime -d solution.jar && java -jar solution.jar' },
    go: { extension: 'go', dockerfile: 'Dockerfile.go', runCmd: 'go run solution.go' },
};

const runInSandbox = async (code: string, testCase: TestCase, language: string): Promise<ExecutionResult> => {
    const config = languageConfigs[language];
    const containerName = `judge-${language}-${Date.now()}`;
    const tmpDir = path.join('/tmp', containerName);
    const codeFile = `solution.${config.extension}`;

    try {
        await fs.mkdir(tmpDir, { recursive: true });
        await fs.writeFile(path.join(tmpDir, codeFile), code);

        // Copy Dockerfile
        const dockerfileContent = await fs.readFile(path.join(__dirname, 'docker', config.dockerfile), 'utf8');
        await fs.writeFile(path.join(tmpDir, 'Dockerfile'), dockerfileContent);

        // Build Docker image
        await execAsync(`docker build -t ${containerName} ${tmpDir}`);

        // Run Docker container with the test case input and timeout
        const { stdout, stderr } = await execAsync(`echo "${testCase.input}" | docker run --rm --network none --memory="256m" --cpus="1" ${containerName} timeout 1s sh -c '${config.runCmd}'`);

        // Compare the output with the expected output
        const success = stdout.trim() === testCase.expectedOutput.trim();
        return { success, output: stdout.trim(), error: stderr.trim() };
    } catch (error) {
        return { success: false, output: '', error: error.message.includes('Command failed') ? '런타임 에러 발생' : error.message };
    } finally {
        // Cleanup
        await execAsync(`docker rmi -f ${containerName}`);
        await fs.rm(tmpDir, { recursive: true, force: true });
    }
};

export { runInSandbox };
