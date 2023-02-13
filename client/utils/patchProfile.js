import { parseCookies } from "nookies";

export const patchUserProfile = async ({ key, value }) => {
  const cookies = parseCookies();

  if (cookies.token) {
    try {
      const url =
        process.env.NEXT_PUBLIC_PROFILE_URL ||
        "http://localhost:5555/user-profile/";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({ label: key, src: value }),
      });
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("MAIL FETCH FAILED", error);
      return null;
    }
  }
};
