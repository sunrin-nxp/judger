import mongo from 'mongoose';

const testcaseSchema = new mongo.Schema({
    input: { type: String, default: "" },
    output: { type: String, default: "" }
});

const userRateSchema = new mongo.Schema({
    userid: { type: String, required: true },
    votedRank: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Number, default: Date.now() }
})

const problemSchema = new mongo.Schema({
    creator: { type: String, required: true },
    problemNumber: { type: Number, required: true }, 
    rankPoint: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    testcases: [ testcaseSchema ],
    answerCode: { type: String, default: "" },
    userRate: [ userRateSchema ],
    createdAt: { type: Number, default: Date.now() }
});

export default mongo.model('problems', problemSchema);