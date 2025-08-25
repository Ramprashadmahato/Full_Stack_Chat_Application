// src/Db/config.js
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://rpxingh201:Ram%401590@cluster0.gyzvwxp.mongodb.net/Chat_Application?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

export default connectDb; // ✅ ES module default export
