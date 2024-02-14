import mongoose from "mongoose";
const { Schema, model } = mongoose;

const statsSchema = new Schema({
  username: String,
  userID: String,
  stats: [{
    category: {
      name: String,
      points: Number
    }
  }
  ],
  createdAt: { type: Date },
})


export default model('Stats', statsSchema)