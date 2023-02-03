import mongoose from "mongoose";
import consoleSuccess from "../utils/consoleSuccess.js";

const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri);
    consoleSuccess(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error : ", error);
    process.exit(1);
  }
};

export default connectDB;
