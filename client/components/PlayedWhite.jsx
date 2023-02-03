import React from "react";
import style from "../styles/cardTemplate.module.css";

const PlayedWhite = ({ card }) => {
  return <div className={`${style.cardTemplateContainer}`}>{card.text}</div>;
};

export default PlayedWhite;
