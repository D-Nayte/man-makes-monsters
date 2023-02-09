import { response, Router } from "express";
import Userprofile from "../database/models/userprofile.js";
import express from "express";
import createUser from "../utils/createuser.js";
import { createToken } from "../utils/jwt.js";
import { protect } from "../middleware/authmiddleware.js";

const router = Router();
router.use(express.json());

router.use(
  express.urlencoded({
    extended: true,
  })
);

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    let foundUser = await Userprofile.findOne({ email });

    if (!foundUser) foundUser = await createUser(res, req.body);
    if (!foundUser) return;
    const profile = {
      name: foundUser.name,
      email: foundUser.email,
      avatar: foundUser.avatar,
    };

    const token = createToken(foundUser._id);
    return res.json({ message: "founduser received", profile, token });
  } catch (error) {
    console.error("Error while fetchin user data", error);
    res.status(500).json({ message: "error while getching user data" });
  }
});

router.patch("/", protect, async (req, res) => {
  const { label, src } = req.body;
  const { user } = req;

  if (!user)
    return res.status(420).json({ message: "UserProfile User not found" });

  delete user._id;

  user[label] = JSON.stringify(src);

  await Userprofile.findByIdAndUpdate(user._id, user);

  delete user.admin;

  res.status(200).json({ message: "success", user });
});

export { router as userProfileRouter };
