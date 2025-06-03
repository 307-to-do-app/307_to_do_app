import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // plain for now — later: hash it
});

export default mongoose.model("User", userSchema);
