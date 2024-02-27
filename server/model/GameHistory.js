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
  newLvl: Boolean,
  correctAnswers: Number,
  allAnswers: Number,
  finished: Boolean,
  longestGoodAnswerStreak: Number,
  createdAt: Date
})

export default model("GameHistory", gameHistorySchema)