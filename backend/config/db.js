import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/filmvora");
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error]: ${error.message}`);
    // In local development, don't immediately crash if Mongo is starting up or configured differently
    console.warn("Continuing server initialization. Make sure MongoDB daemon is running.");
  }
};

export default connectDB;
