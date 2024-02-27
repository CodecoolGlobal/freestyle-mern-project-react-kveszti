import mongoose from "mongoose";

const { Schema, model } = mongoose;

const questionSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: "GameHistory"
  },
  question: String,
  correctAnswer: String,
  incorrectAnswers: [String],
  choosenAnswer: String,
  isCorrect: Boolean,
  difficulty: String,
  category: String,
  points: Number,
})

export default model("Question", questionSchema)