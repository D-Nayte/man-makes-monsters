import mongoose from "mongoose";

const pogmessages = mongoose.Schema(
  {
    name: String,
    email: String,
    description: String,
    priority: Number,
  },
  {
    timestamps: true,
  }
);

const Pogmessages = mongoose.model("Pogmessages", pogmessages);

export default Pogmessages;
