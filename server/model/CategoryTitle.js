import mongoose from "mongoose";
const { model, Schema } = mongoose;

const categoryTitleSchema = new Schema({
  category: String,
  "1": String,
  "10": String,
  "25": String,
  "50": String,
});

export default model("CategoryTitle", categoryTitleSchema);