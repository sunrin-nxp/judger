import mongo from "mongoose"
import { config } from "dotenv";
config();

export function linkToDatabase() {
    let murl; let env = process.env;
    murl = `mongodb+srv://${env.DB_ID}:${env.DB_PW}@${env.DB_CLUSTER}.${env.DB_CODE}.mongodb.net/${env.DB_FOLDER}`
    mongo.connect(`${murl}`).then(() => {
        console.log('db connected');
    }).catch((e) => {
        throw new Error(e);
    });
}