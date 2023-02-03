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
        <li>
          <h3>Amount of Cards per Player</h3>
        </li>
        <li>
          <button onClick={handleDecrement}>
            <BsFillArrowDownSquareFill className="settingsButton" />
          </button>
          <input
            className="settingsInput"
            type="number"
            value={handSize}
            min="1"
            max="10"
            placeholder="Default 10"
            onChange={(e) => handleChange(e.target.value)}
          />
          <button onClick={handleIncrement}>
            <BsFillArrowUpSquareFill className="settingsButton" />
          </button>
        </li>
        <li>
          <h3>Max amount of rounds</h3>
        </li>
        <li>
          <button onClick={handleRoundsDecrement}>
            <BsFillArrowDownSquareFill className="settingsButton" />
          </button>
          <input
            className="settingsInput"
            value={amountOfRounds}
            type="number"
            placeholder="Default 10"
            onChange={(e) => setRoundsValue(parseInt(e.target.value))}
          />
          <button onClick={handleRoundsIncrement}>
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
                onChange={(e) => setLanguage(e.target.value)}
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
                onChange={(e) => setLanguage(e.target.value)}
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
