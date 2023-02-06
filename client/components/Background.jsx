import React, { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import allCardBackgrounds from "../public/assets/cardpictures";

function Background({
  showBackground,
  setShowBackground,
  selectedBackground,
  setSelectedBackground,
}) {
  if (!showBackground) return;
  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <button onClick={() => setShowBackground(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>

        <h2>Choose Your background</h2>
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

export default Background;
