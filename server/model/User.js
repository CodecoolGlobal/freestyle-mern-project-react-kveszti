import mongoose from "mongoose";
const { Schema, model } = mongoose;


const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  birthday: { type: Date, required: false },
  gender: { type: String, required: false },
  createdAt: { type: Date },
  longestStreakThroughGames: Number,
  longestStreakOneGame: Number
});


export default model('User', userSchema);