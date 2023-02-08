import React, { useEffect, useState } from "react";
import { CgCloseO } from "react-icons/cg";

function AdminMail({ showMail, setShowMail, storedMailData }) {
  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <h1>Admin Mail</h1>
        <button onClick={() => setShowMail(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
        <div className="adminMailContainer">
          {storedMailData &&
            storedMailData.map((response, i) => (
              <div key={i}>
                <p>Name: {response.name}</p>
                <p>Email: {response.email}</p>
                <p>Description: {response.description}</p>
                <p>Priority: {response.priority}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AdminMail;
