import React, { useEffect, useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import CaptchaLogo from "./CaptchaLogo";
import { validateCaptcha } from "../utils/validateCaptcha";

function ReportBug({
  showBug,
  setShowBug,
  setSuccessMessage,
  setShowErrMessage,
}) {
  if (!showBug) return;
  const [charCount, setCharCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    priority: "low",
  });

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitted(true);
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.description === ""
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

    // Send formData to the server or handle it as needed
    const url =
      process.env.NEXT_PUBLIC_MAIL_URL || "http://localhost:5555/admin-mail/";
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          description: "",
          priority: "low",
        });
        setCharCount(0);
        setSuccessMessage("Thanks for your report :)");
        setShowBug(false);

        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
        return;
      }
      setShowErrMessage("Failed to send the report. Please try again later");
    } catch (error) {
      setShowErrMessage("This was not working :/ please try again");
      console.error("failed to fetch", error);
    }
  };

  return (
    <div className="gameRulesBackdrop fullscreenMobile">
      <div className="gameRules bugReportContainer">
        <CaptchaLogo isValidating={isValidating} />
        <h1>Bug Report</h1>
        <button onClick={() => setShowBug(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
        <form
          className="bug-report-form"
          onSubmit={(event) => {
            handleSubmit(event);
          }}
        >
          <div className="form-group">
            <label
              htmlFor="name"
              style={
                submitted && formData.name === "" ? { color: "red" } : null
              }
            >
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
              }
            >
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
              htmlFor="description"
              style={
                submitted && formData.description === ""
                  ? { color: "red" }
                  : null
              }
            >
              Description:
            </label>
            <textarea
              onInput={(e) => {
                setCharCount(e.target.value.length);
              }}
              maxLength={200}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <p>Characters: {charCount}/200</p>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              onChange={handleInputChange}
              defaultValue={formData.priority}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button type="submit" className="bugSubmit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportBug;
