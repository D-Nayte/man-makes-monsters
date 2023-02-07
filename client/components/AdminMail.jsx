import React, { useEffect } from "react";
import { CgCloseO } from "react-icons/cg";

function AdminMail({
  showMail,
  setShowMail,
  responseDataArray,
  setResponseDataArray,
}) {
  if (!showMail) return;

  useEffect(() => {
    if (responseDataArray.length > 6) {
      setResponseDataArray(responseDataArray.slice(1));
    }
  }, [responseDataArray]);

  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <h1>Admin Mail</h1>
        <button onClick={() => setShowMail(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
        <div className="adminMailContainer">
          {responseDataArray.map((response, i) => (
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
