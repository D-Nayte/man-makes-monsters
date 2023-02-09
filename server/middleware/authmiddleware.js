import jwt from "jsonwebtoken";
import Userprofile from "../database/models/userprofile.js";
import asyncHandler from "express-async-handler";
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from Bearer
      token = req.headers.authorization.split(" ")[1];
      console.log("token", token);
      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //Get user from token
      req.user = await Userprofile.findById(decoded.id);
      console.log("decoded.id", decoded.id);
      next();
    } catch (error) {
      console.error(error);
      req.user = null;
    }
  }
});
