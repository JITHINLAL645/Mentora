// import mongoose from "mongoose"

// const connectDB = async () => {
//     try {
//         const connect = await mongoose.connect('mongodb://localhost:27017/Mentora')
//                 console.log("MongoDB Connected!");

//        console.log(`conncted ${connect.connection.host}`)

//     } catch (error) {
//         console.error('monogo db connecting error', error);
//         return;
//     }
// }

// export default connectDB

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Mentora");
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
