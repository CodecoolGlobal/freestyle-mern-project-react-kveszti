import mongoose from "mongoose";
const { Schema, model } = mongoose;

const statsSchema = new Schema({
  userRef: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
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