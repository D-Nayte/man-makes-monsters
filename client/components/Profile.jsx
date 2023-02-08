import React, { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { AiOutlineLock } from "react-icons/ai";
import allCardBackgrounds from "../public/assets/cardpictures";
import Ladybug from "./Ladybug";

function Profile({
  showProfileMenu,
  setShowProfileMenu,
  setSelectedCardBackground,
  selectedCardBackground,
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
          <div className="lockedCard ">
            <AiOutlineLock className="lockedIcon" />
            <Ladybug />
          </div>
          {allCardBackgrounds.map((cardObject) => {
            return (
              <div
                className={`whiteCardFaceMock whiteCardFace--frontMock ${
                  selectedCardBackground.SVG === cardObject.SVG
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelectedCardBackground(cardObject)}
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
