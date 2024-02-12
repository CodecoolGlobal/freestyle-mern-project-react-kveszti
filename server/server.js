import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import User from "./model/User.js";

dotenv.config();

const app = express();

mongoose.connect(process.env.CONSTRING).then(app.listen(3000, () => {
  console.log("Server running on: http://localhost:3000")
})).catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("hi")
});
