import Image from "next/image";
import React, { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import allBackgrounds from "../public/assets/backgrounds";

function Background({
  showBackground,
  setShowBackground,
  selectedBackground,
  setSelectedBackground,
}) {
  if (!showBackground) return;
  return (
    <div className="gameRulesBackdrop fullscreenMobile">
      <div className="gameRules">
        <button onClick={() => setShowBackground(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>

        <h2>Choose Your background</h2>
        <div className="backgroundsContainer fullscreenMobileContainer">
          {allBackgrounds.map((backgroundObject) => {
            return (
              <div
                className={`backgroundMock whiteCardFace--frontMock ${
                  selectedBackground.SVG === backgroundObject.SVG
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelectedBackground(backgroundObject)}
                key={backgroundObject.label}
              >
                <Image
                  width={1}
                  height={1}
                  src={backgroundObject.SVG}
                  alt=""
                  className="profileCcMock"
                />
                <div>
                  <p>{backgroundObject.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Background;
