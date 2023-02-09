import mongoose from "mongoose";

const userprofile = mongoose.Schema(
  {
    name: String,
    email: String,
    avatar: String || null,
    admin: Boolean,
    favoritebackground: String || null,
    favoritecard: String || null,
    ladybug: Boolean,
  },
  {
    timestamps: true,
  }
);

const Userprofile = mongoose.model("userprofile", userprofile);

export default Userprofile;
