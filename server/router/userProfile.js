import { response, Router } from "express";
import Userprofile from "../database/models/userprofile.js";
import express from "express";
import createUser from "../utils/createuser.js";
import { createToken } from "../utils/jwt.js";
import cors from "cors";
import { protect } from "../middleware/authmiddleware.js";
import { convertUserData } from "../utils/convertUserData.js";

const router = Router();
router.use(express.json());
router.use(cors());
router.use(
  express.urlencoded({
    extended: true,
  })
);

//login user or create new user
router.post("/", async (req, res) => {
  const { email } = req.body;
  let token;
  try {
    let foundUser = await Userprofile.findOne({ email });

    if (!foundUser) {
      foundUser = await createUser(res, req.body);
      token = createToken(foundUser._id);
    }

    if (!foundUser) return;
    const profile = convertUserData(foundUser);

    return res.json({ message: "founduser received", profile, token });
  } catch (error) {
    console.error("Error while fetchin user data", error);
    res.status(500).json({ message: "error while getching user data" });
  }
});

//change user data
router.patch("/", protect, async (req, res) => {
  const { label, src } = req.body;
  const { user } = req;

  if (!user)
    return res.status(420).json({ message: "UserProfile User not found" });

  user[label] = JSON.stringify(src);

  await Userprofile.findByIdAndUpdate(user._id, user);

  const userData = convertUserData(user);

  res.status(200).json({ message: "success", user: userData });
});

export { router as userProfileRouter };
