import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { CgCloseO } from "react-icons/cg";
import { validateCaptcha } from "../utils/validateCaptcha";
import CaptchaLogo from "./CaptchaLogo";
import emailjs from "@emailjs/browser";

function Contact({
  showContact,
  setShowContact,
  setSuccessMessage,
  setShowErrMessage,
}) {
  if (!showContact) return;
  const [isValidating, setIsValidating] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.message === ""
    )
      return setShowErrMessage("Please fill in each field");

    //get recaptha token and validate
    if (!executeRecaptcha) return;
    setIsValidating(true);
    const valdidation = await validateCaptcha(
      executeRecaptcha,
      setShowErrMessage
    );
    if (!valdidation) return;
    setIsValidating(false);

    // Send formData to server or do something else here
    try {
      const response = await emailjs.send(
        "service_jgoymz7",
        "template_rb5gpbr",
        formData,
        "Af9obEhLKFtcQVNRT"
      );

      setSubmitted(false);
      if (response.status === 200) {
        setSuccessMessage("Thanks for your mail, we will responde soon");
        setShowContact(false);

        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
        setFormData({ name: "", email: "", message: "" });
        return;
      }
      setShowErrMessage("Could not send mail, please try again later");
    } catch (error) {
      console.error("Sending mail failed:", error);
      setShowErrMessage("Could not send mail, please try again later");
      setSubmitted(false);
    }
  };

  return (
    <div className="gameRulesBackdrop">
      <CaptchaLogo isValidating={isValidating} />

      <div className="gameRules">
        <h1>Contact us</h1>
        <button onClick={() => setShowContact(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label
              htmlFor="name"
              style={
                submitted && formData.name === "" ? { color: "red" } : null
              }>
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="email"
              style={
                submitted && formData.email === "" ? { color: "red" } : null
              }>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="message"
              style={
                submitted && formData.message === "" ? { color: "red" } : null
              }>
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
