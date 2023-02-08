import React, { useState } from "react";
import Ukflag1 from "../public/Ukflag1.svg";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";

const Settings = ({
  setHandSize,
  setAmountOfRounds,
  amountOfRounds,
  handSize,
  language,
  setLanguage,
}) => {
  const [error, setError] = useState(false);

  const handleChange = () => {
    if (handSize > 10) {
      setHandSize(10);
      return setError(true);
    }
    setError(false);
    setHandSize(handSize);
  };

  const handleIncrement = () => {
    //+
    if (handSize < 10) {
      setHandSize(handSize + 1);
    }
  };

  const handleDecrement = () => {
    //-
    if (handSize > 1) {
      setHandSize(handSize - 1);
    }
  };

  const handleRoundsIncrement = () => {
    //rounds ++
    if (amountOfRounds < 20) {
      setAmountOfRounds(amountOfRounds + 1);
    }
  };

  const handleRoundsDecrement = () => {
    //rounds --
    if (amountOfRounds > 1) {
      setAmountOfRounds(amountOfRounds - 1);
    }
  };

  return (
    <>
      <ul className="settingsInputContainer">
        {error && (
          <li>
            <h2 style={{ color: "red" }}>
              Maximum Amount of Cards is 10. Changed back to default(10)
            </h2>
          </li>
        )}
        <div
          style={{
            position: "absolut",
            top: "0",
            height: "100%",
            width: "100%",
            zIndex: "5",
            backgroundColor: "red",
          }}>
          Not available in demo
        </div>
        <li>
          <h3>Amount of Cards per Player</h3>
        </li>
        <li>
          <button>
            <BsFillArrowDownSquareFill className="settingsButton" />
          </button>
          <input
            className="settingsInput"
            type="number"
            value={handSize}
            min="1"
            max="10"
            placeholder="Default 10"
            readOnly
          />
          <button>
            <BsFillArrowUpSquareFill className="settingsButton" />
          </button>
        </li>
        <li>
          <h3>Max amount of rounds</h3>
        </li>
        <li>
          <button>
            <BsFillArrowDownSquareFill className="settingsButton" />
          </button>
          <input
            className="settingsInput"
            value={amountOfRounds}
            type="number"
            placeholder="Default 10"
            readOnly
          />
          <button>
            <BsFillArrowUpSquareFill className="settingsButton" />
          </button>
        </li>
        <li>
          <h3>Languages</h3>
        </li>
        <li>
          <div className="language-wrapper">
            <div>
              <label htmlFor="english">English</label>
              <input
                type="radio"
                name="language"
                value="english"
                id="english"
                readOnly
                checked={language === "english" ? true : false}
              />
            </div>
            <div>
              <label htmlFor="german">German</label>
              <input
                type="radio"
                name="language"
                value="german"
                id="german"
                readOnly
                checked={language === "german" ? true : false}
              />
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default Settings;
