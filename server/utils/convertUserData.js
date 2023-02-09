export const convertUserData = (dbUserData) => {
  return {
    name: dbUserData.name,
    email: dbUserData.email,
    avatar: dbUserData.avatar,
    favoritebackground: dbUserData.favoritebackground,
    favoritecard: dbUserData.favoritecard,
  };
};
