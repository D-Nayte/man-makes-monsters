import React, { useEffect, useState } from "react";
import style from "../styles/cardTemplate.module.css";

const BlackCardInDeck = ({
  card,
  index,
  drawCardsToSelect,
  playedBlack,
  selectBlackCard,
}) => {
  const [randomDeg, setrandomDeg] = useState(0);
  const [active, setactive] = useState(false);
  const [ischoosed, setIschoosed] = useState(false);
  const randomCardTurn = () => setrandomDeg(Math.random() * 10 - 5);

  //style for displaying 3 cards to choose from
  let presentOptions = {
    transform: `translateY(0) translateZ(0) rotateX(0deg) rotateY(0deg)
    rotateZ(0deg) translateX(${-160 + index * 110}%)`,
  };

  //standart style while lying on deck
  let defaultOptions = {
    transform: `translateY(${index / 8}px) translateX(${
      randomDeg + 10
    }px) rotateX(50deg) rotateY(-10deg) rotateZ(${randomDeg + 30}deg)`,
    zIndex: -index,
    pointerEvents: index > 1 ? "none" : "all",
    margin: "0rem",
  };

  // style if a card got choosed
  let choosed = {
    transform: `translateY(0) translateZ(0) rotateX(0deg) rotateY(0deg)
    rotateZ(0) translateX(0)`,
  };

  // animation section to animate the card from the deck to the actuall "table"
  const animateCard = () => {
    //animate your card
    return;
  };

  const blackIsSelected = (index) => {
    setIschoosed(true);

    animateCard();

    // timeout befor cards going back to deck
    setTimeout(() => {
      setIschoosed(false);
      setactive(false);
      selectBlackCard(index);
    }, 1000);
  };

  useEffect(() => {
    playedBlack[index]?.text === card.text ? setactive(true) : setactive(false);
  }, [playedBlack]);

  useEffect(() => {
    randomCardTurn();
  }, []);

  return (
    <li
      onClick={
        !active
          ? () => drawCardsToSelect(index)
          : () => {
              blackIsSelected(index);
            }
      }
      className={`${style.cardTemplateContainer} ${style.black} ${
        ischoosed ? "choosed" : active ? "active" : "default "
      }`}
      style={ischoosed ? choosed : active ? presentOptions : defaultOptions}>
      {card.text + index}
    </li>
  );
};

export default BlackCardInDeck;
