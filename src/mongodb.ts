import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  mongodbUri: process.env.MONGODB_URI,
};

console.log('🚀 ~ file: mongodb.ts:8 ~ process.env.MONGODB_URI', process.env.MONGODB_URI);
const client = new MongoClient(process.env.MONGODB_URI as string, {
  serverApi: ServerApiVersion.v1,
});
// const client = new MongoClient(
//   'mongodb+srv://mohelmy:xJka4LH9GuEoF3xW@cluster0.s13ivsk.mongodb.net/godzilla?retryWrites=true&w=majority',
//   {
//     serverApi: ServerApiVersion.v1,
//   }
// );

export default client;
