import mongoose from "mongoose";

const { Schema, model } = mongoose;

const gameHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  questionsAndAnswers: [{
    type: Schema.Types.ObjectId,
    ref: "Question"
  }],
  gainedPoints: Number,
  gameMode: String,
  correctAnswers: Number,
  allAnswers: Number,
  finished: Boolean,
  longestGoodAnswerStreak: Number,
  createdAt: Date,
  category: String,
  difficulty: String,
})

export default model("GameHistory", gameHistorySchema)