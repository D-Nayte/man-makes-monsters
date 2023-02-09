import Userprofile from "../database/models/userprofile.js";
import randomName from "../utils/randomName.js";

const createUser = async (res, userData) => {
  const { name, email, avatar, favoritebackground, favoritecard } = userData;
  if (!email) {
    res.status(400).json({ message: "the user profile not found" });
    return null;
  }

  const userProfile = {
    name,
    email,
    avatar: null,
    admin: false,
    favoritebackground,
    favoritecard,
    ladybug: false,
  };
  if (!name && email) userProfile.name = randomName();
  const response = await Userprofile.create(userProfile);

  if (!response) {
    res.status(400).json({ message: "the response was not found" });
    return null;
  }
  return response;
};

export default createUser;
