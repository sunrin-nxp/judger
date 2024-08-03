import { Injectable } from '@nestjs/common';
import Problems from './interface/problems.interface';
import { runInSandbox } from './utils/sandbox.util';
import doTest from './interface/doTest.interface';
import problemsSchema from './models/problems.schema';
import Testcases from './interface/testcase.interface';

@Injectable()
export class AppService {
  async runTest(problemData: doTest, language: String) {
    const problem = await problemsSchema.findOne({ problemNumber: problemData.problemNumber });
    let testcases: Testcases[] = problem.testcases; let successFlag: Boolean = true; // Successs 0, Failue 1
    for (const testcase of testcases) {
      const result = await runInSandbox(problemData.usercode, testcase, `${language}`);
      successFlag = true ? result.success : false;
    }
    return {
      result: '정답입니다' ? successFlag == true : '틀렸습니다'
    };
  }
}
