import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config(); 

let MongoURI = process.env.MONGO_URI;
export const connectToDB = async () => {
  try {
    await mongoose.connect(MongoURI, {
      dbName: "QnA",
    });
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};
