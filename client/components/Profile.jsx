import React, { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import allCardBackgrounds from "../public/assets/cardpictures";

function Profile({
  showProfileMenu,
  setShowProfileMenu,
  setSelectedBackground,
  selectedBackground,
}) {
  if (!showProfileMenu) return;
  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <h1>Profile</h1>
        <button onClick={() => setShowProfileMenu(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>

        <h2>Choose Your Card background</h2>
        <div className="profileCardsContainer">
          {allCardBackgrounds.map((cardObject) => {
            return (
              <div
                className={`whiteCardFaceMock whiteCardFace--frontMock ${
                  selectedBackground.SVG === cardObject.SVG ? "selected" : ""
                }`}
                onClick={() => setSelectedBackground(cardObject)}
              >
                <img src={cardObject.SVG} alt="" className="profileCcMock" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Profile;
