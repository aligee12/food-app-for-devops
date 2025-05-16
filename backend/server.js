import express, { application } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";

import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//app config
const app = express(); //creatind an express application
const port = 5000;
const url = `http://localhost:${port}`;

//middleware
app.use(express.json()); //to parse json data in req to javascript object
app.use(cors());

//db connection
connectDB();

//api routes
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("Api working");
});
app.listen(port, () => {
  console.log(`server is working on ${url}`);
});
