import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import User from "./model/User.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.CONSTRING).then(app.listen(3000, () => {
  console.log("Server running on: http://localhost:3000")
})).catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("hi")
});

app.post("/api/users/all", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const createdAt = Date.now();
    const user = new User({
      username,
      email,
      password,
      createdAt,
    });
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: 'Failed to register please try again' });
  }
})

app.patch("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email: email })
    if (user) {
      if (user.password === password) {
        res.status(201).json({ success: true, data: { username: user.username, userID: user._id } })
      } else {
        res.status(201).json({ success: false, error: "Password is incorrect." })
      }
    } else {
      res.status(404).json({ success: false, error: 'User not found.' })
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: 'Failed to register please try again' });
  }
})