export const validateCaptcha = async (executeRecaptcha, setShowErrMessage) => {
  const token = await executeRecaptcha();
  if (!token) {
    return setShowErrMessage("Captcha failed!");
  }
  try {
    const result = await fetch("/api/secure/validateCaptcha", {
      method: "POST",
      body: token,
    });

    if (!result.ok) {
      const data = await result.json();
      console.error("validation error:", data.message);
      setShowErrMessage("Captcha validation failed!");
      return result.ok;
    }
    return result.ok;
  } catch (error) {
    console.error("Validation server error:", error);
  }
};
