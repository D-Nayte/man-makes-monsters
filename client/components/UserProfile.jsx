import React, { useState } from "react";
import { useEffect } from "react";
import { CgCloseO } from "react-icons/cg";

function UserProfile({ showUserProfile, setShowUserProfile }) {
  const [storedProfileData, setStoredProfileData] = useState(null);
  if (!showUserProfile) return;

  const getuserProfileDetails = async () => {
    try {
      const url =
        process.env.NEXT_PUBLIC_PROFILE_URL ||
        "http://localhost:5555/user-profile/";
      const response = await fetch(url);
      const data = await response.json();
      if (data) {
        setStoredProfileData(data);
      }
    } catch (error) {
      console.error(" USER PROFILE NOT FOUND", error);
    }
  };

  useEffect(() => {
    getuserProfileDetails();
  }, []);

  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <h1>USER PROFILE</h1>
        <button onClick={() => setShowUserProfile(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
