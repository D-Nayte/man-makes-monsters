import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ...add more providers here
  ],
  //EVENTS HERE

  onUser: async (user, account, profile) => {
    console.log(`User signed in with ${account.provider} account`);
    console.log(user, "user");
    console.log(profile, "Profile");
  },

  authorization: {
    // Pass the cookie to the client for authentication via a cookie.
    // Used when the user signs in with a provider.
    // (not used for API requests)
    cookie: true,

    // Use a popup window instead of a full page redirect.
    // (not used for API requests)
    popup: true,

    // The method used to redirect the user to the sign-in page when
    // they are not authenticated. Can also be set to "manual" which
    // requires you to handle redirects yourself.
    // (not used for API requests)
    redirect: true,
  },
};
export default NextAuth(authOptions);
