interface Testcases {
    input: String;
    output: String;
}

interface Problems {
    creator?: String;
    rank: Number;
    subject: String;
    content: String;
    testcases: [ Testcases ];
}

export default Problems;