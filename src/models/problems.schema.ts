import mongo from 'mongoose';

const testcaseSchema = new mongo.Schema({
    input: { type: String, default: "" },
    output: { type: String, default: "" }
});

const problemSchema = new mongo.Schema({
    creator: { type: String, required: true },
    rankPoint: { type: Number, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    testcases: [ testcaseSchema ],
});

export default mongo.model('problems', problemSchema);