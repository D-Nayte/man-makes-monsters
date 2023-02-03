import React, { useState } from "react";
import { CgCloseO } from "react-icons/cg";

function ReportBug({ showBug, setShowBug }) {
  if (!showBug) return;
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

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send formData to the server or handle it as needed
  };

  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <h1>Bug Report</h1>
        <button onClick={() => setShowBug(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
        <form className="bug-report-form" onSubmit={handleSubmit}>
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
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}>
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
