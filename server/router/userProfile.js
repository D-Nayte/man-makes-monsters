import { response, Router } from "express";
import Userprofile from "../database/models/userprofile.js";
import express from "express";

const router = Router();
router.use(express.json());

router.use(
  express.urlencoded({
    extended: true,
  })
);

router.post("/", async (req, res) => {
  const { name, email, avatar, favoritebackground, favoritecard } = req.body;
  const foundUser = await Userprofile.findOne({ email });
  if (!foundUser) {
    const userProfile = {
      name,
      email,
      avatar,
      token: null,
      admin: false,
      favoritebackground,
      favoritecard,
      ladybug: false,
    };

    if (!name || !email)
      return res.status(400).json({ message: "the user profile not found" });

    const response = await Userprofile.create(userProfile);
    if (!response)
      return res.status(400).json({ message: "the response was not found" });
    return res.json({ message: "succesfully send response", email });
  }
  return res.json({ message: "founduser received", email: foundUser.email });
});

export { router as userProfileRouter };
