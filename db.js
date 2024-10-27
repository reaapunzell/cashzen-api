import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const dbConnect = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MongoDB URI is not defined. Please set the MONGODB_URI environment variable.");
    }

    await mongoose.connect(MONGODB_URI);
    console.log(`[database]: connected to db`);
  } catch (err) {
    console.warn(`[database error]: ${err.message}`);
  }
};

export { dbConnect, mongoose };
