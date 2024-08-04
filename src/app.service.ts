import { Injectable, Logger } from '@nestjs/common';
import { runInSandbox } from './utils/sandbox.util';
import doTest from './interface/doTest.interface';
import problemsSchema from './models/problems.schema';
import Testcases from './interface/testcase.interface';

@Injectable()
export class AppService {
  private readonly logger = new Logger("App Service");

  async runTest(problemData: doTest) {
    const problem = await problemsSchema.findOne({ problemNumber: problemData.problemNumber });
    let testcases: Testcases[] = problem.testcases; let successFlag: Boolean = true; // Successs 0, Failue 1
    for (const testcase of testcases) {
      const result = await runInSandbox(problemData.usercode, testcase, `${problemData.language}`);
      successFlag = true ? result.success : false;
    }
    let res: String; if(successFlag)res="정답입니다";else res="틀렸습니다";
    return {
      result: res
    };
  }
}
