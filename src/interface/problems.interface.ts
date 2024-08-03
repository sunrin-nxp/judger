import Testcases from "./testcase.interface";

interface Problems {
    creator?: String;
    problemNumber: Number;
    rankPoint: Number;
    subject?: String;
    content?: String;
    testcases: [ Testcases ];
    createdAt?: Number;
}

export default Problems;