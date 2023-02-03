import React from "react";
import { CgCloseO } from "react-icons/cg";

function Profile({ showProfileMenu, setShowProfileMenu }) {
  if (!showProfileMenu) return;
  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <h1>Profile</h1>
        <button onClick={() => setShowProfileMenu(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
      </div>
    </div>
  );
}

export default Profile;
