import { useSession } from "next-auth/react";
import { parseCookies, setCookie } from "nookies";
import React, { useState } from "react";
import { useEffect } from "react";
import { CgCloseO } from "react-icons/cg";
import { useAppContext } from "../context";

function UserProfile({ showUserProfile, setShowUserProfile }) {
  const { storeData } = useAppContext();
  const session = useSession();

  if (!showUserProfile) return;

  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <h1>USER PROFILE</h1>
        {storeData?.profile && session && (
          <ul className="profileDetailsWrapper">
            <li>Account name : {session?.data?.user?.name || "No name"}</li>
            <li>Email:{storeData.profile.email}</li>
            <li>Avatar name : {storeData.profile.name}</li>
            <li>Favorite card background: {storeData.profile.favoritecard} </li>
            <li>Favorite background: {storeData.profile.favoritebackground}</li>
          </ul>
        )}
        <button onClick={() => setShowUserProfile(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
