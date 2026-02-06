import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected!!");
  } catch (error) {
    console.error(`MongoDB Connection failed :${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to mongoDB");
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected to mongoDB");
});
mongoose.connection.on("error", () => {
  console.log(`Mongoose connection error: ${err}`);
});

//shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});
export default connectDB;
