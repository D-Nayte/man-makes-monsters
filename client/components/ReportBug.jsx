import React, { useState } from "react";
import { CgCloseO } from "react-icons/cg";

function ReportBug({
  showBug,
  setShowBug,
  setSuccessMessage,
  setShowErrMessage,
}) {
  const [charCount, setCharCount] = useState(0);

  const [formData, setFormData] = useState({
    name: null,
    email: null,
    description: null,
    priority: "low",
  });

  if (!showBug) return;
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
          name: null,
          email: null,
          description: null,
          priority: "low",
        });
      }
      setSuccessMessage("Thanks for your report :)");
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
    } catch (error) {
      setShowErrMessage("This was not working :/ please try again");
      console.error("failed to fetch", error);
    }
  };

  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <h1>Bug Report</h1>
        <button onClick={() => setShowBug(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
        <form
          className="bug-report-form"
          onSubmit={(event) => {
            handleSubmit(event);
            setShowBug(false);
          }}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
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
              defaultValue={formData.priority}>
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
