import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectDB = () => {
  return mongoose.connect(process.env.DB_HOME as string, (error) => {
    if (!error) console.log("Connected");
    else console.log(error);
  });
};

export default connectDB;
