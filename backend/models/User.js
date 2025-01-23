import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  counter: { type: Number, default: 0 },
  prizes: { type: Number, default: 0 },
});

export default mongoose.model("User", userSchema);
