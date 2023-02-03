import React, { useState } from "react";
import { CgCloseO } from "react-icons/cg";

function Contact({ showContact, setShowContact }) {
  if (!showContact) return;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send formData to server or do something else here
    alert(
      `Name: ${formData.name} \n Email: ${formData.email} \n Message: ${formData.message}`
    );
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <h1>Contact us</h1>
        <button onClick={() => setShowContact(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
        <form className="contact-form" onSubmit={handleSubmit}>
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
            <label htmlFor="message">Message:</label>
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
