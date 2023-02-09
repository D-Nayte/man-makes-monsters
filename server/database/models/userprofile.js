import mongoose from "mongoose";

const userprofile = mongoose.Schema(
  {
    name: String,
    email: String,
    avatar: String || null,
    admin: Boolean,
    favoritebackground: String,
    favoritecard: String,
    ladybug: Boolean,
  },
  {
    timestamps: true,
  }
);

const Userprofile = mongoose.model("userprofile", userprofile);

export default Userprofile;
