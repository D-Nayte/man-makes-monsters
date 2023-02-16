import React from "react";

const CaptchaLogo = ({ isValidating }) => {
  return (
    <div
      className={
        !isValidating
          ? "captchaLogo-container"
          : "captchaLogo-container validating"
      }>
      <img src="/captcha.png" alt="" />
      <p>reCaptcha</p>
    </div>
  );
};

export default CaptchaLogo;
