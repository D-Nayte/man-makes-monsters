import { parseCookies, setCookie } from "nookies";
import React, { useState } from "react";
import { useEffect } from "react";
import { CgCloseO } from "react-icons/cg";
import { useAppContext } from "../context";

function UserProfile({ showUserProfile, setShowUserProfile }) {
  const { storeData } = useAppContext();

  if (!showUserProfile) return;

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
