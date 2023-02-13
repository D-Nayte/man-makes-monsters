import { parseCookies, setCookie } from "nookies";

// fetch admin mails
export const getMails = async (session) => {
  const cookies = parseCookies();
  if (cookies.token !== undefined) {
    try {
      const url =
        process.env.NEXT_PUBLIC_GETMAILS_URL ||
        "http://localhost:5555/admin-mail/fetchmail/";
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        method: "POST",
        body: JSON.stringify({ email: session.user.email }),
      });
      const data = await response.json();
      if (data && response.ok) {
        return data;
      }
    } catch (error) {
      console.error("MAIL FETCH FAILED", error);
    }
  }
};

// login in and fetch user data from db
export const getuserProfileDetails = async (session) => {
  const cookies = parseCookies();

  try {
    const url =
      process.env.NEXT_PUBLIC_PROFILE_URL ||
      "http://localhost:5555/user-profile/";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: session.user.email }),
    });
    const data = await response.json();

    if (data) {
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      setCookie(null, "token", data.token, {
        path: "/",
        expires: expires,
      });

      return data.profile;
    }
  } catch (error) {
    console.error(" USER PROFILE NOT FOUND", error);
  }
};
