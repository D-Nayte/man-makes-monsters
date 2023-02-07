import React, { useEffect, useState } from "react";
import { CgCloseO } from "react-icons/cg";

function AdminMail({ showMail, setShowMail }) {
  const [storedMailData, setStoredMailData] = useState(null);

  const getMails = async () => {
    try {
      const url =
        process.env.NEXT_PUBLIC_GETMAILS_URL ||
        "http://localhost:5555/admin-mail/fetchmail/";
      const response = await fetch(url);
      const data = await response.json();
      if (data) {
        setStoredMailData(data);
      }
    } catch (error) {
      console.error(" MAIL FETCH FAILED", error);
    }
  };

  useEffect(() => {
    getMails();
  }, []);

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
