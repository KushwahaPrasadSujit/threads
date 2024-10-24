import mongoose from "mongoose";

//variable to check the connection status of mongoose.
let isConnected = false;

export const connectToDB = async () => {
  //this is to prevent unknown field theory.
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("mongodb URL not found");

  if (isConnected) return console.log("Already Connected to MONGO DB");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};
