import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Db connected"))
    .catch((error) => console.log(`we have a problem in db file: ${error}`));
};
