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
        <div
          style={{
            position: "absolut",
            top: "0",
            height: "100%",
            width: "100%",
            zIndex: "5",
            backgroundColor: "red",
          }}>
          Not available in demo
        </div>
        <button>
          <CgCloseO
            className="closeMenuButton"
            onClick={() => setShowBug(false)}
          />
        </button>
        <form className="bug-report-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              readOnly>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="bugSubmit"
            style={{ color: "gray" }}
            disabled>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportBug;
