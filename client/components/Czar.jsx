import React, { useEffect, useRef, useState } from "react";
import style from "../styles/cardTemplate.module.css";
import { motion as m } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Czar = ({ blackCards, chooseBlackCard, setBlackCards, gameStage }) => {
  const [showBlackCards, setshowBlackCards] = useState([]);
  const [activeIndex, setActiveIndex] = useState(false);
  const [scrollLeftandRight, setScrollLeftandRight] = useState(0);
  const czarPickingContainerRef = useRef(null);

  const handleScrollLeft = () => {
    const fullWidth = czarPickingContainerRef.current.offsetWidth;
    const minWidth = fullWidth - fullWidth / 2;
    const cardWidth =
      czarPickingContainerRef.current.childNodes[0].getBoundingClientRect()
        .width;

    setScrollLeftandRight((prev) => prev + cardWidth);
    if (0 < scrollLeftandRight) {
      setScrollLeftandRight(minWidth - cardWidth / 2);
    }
  };
  const handleScrollRight = () => {
    const fullWidth = czarPickingContainerRef.current.offsetWidth;
    const cardWidth =
      czarPickingContainerRef.current.childNodes[0].getBoundingClientRect()
        .width;
    const maxWidth = -(fullWidth / 2) + cardWidth * 2;
    const listLength = czarPickingContainerRef.current.childNodes.length;
    const listPadding = fullWidth / listLength - cardWidth;
    const lastCard = (fullWidth / listLength) * (listLength - 1) + listPadding;

    setScrollLeftandRight((prev) => prev - cardWidth - listPadding);
    if (-(lastCard / 2) + cardWidth >= scrollLeftandRight) {
      return setScrollLeftandRight(
        -(lastCard / 2) + cardWidth >=
          scrollLeftandRight - listPadding - listPadding / 2
      );
    }
  };
  const styles = {
    transform: `translateX(${scrollLeftandRight}px)`,
  };

  // get randokm black cards and let czar decide
  const randomBlackCards = () => {
    const amountCardsToSelect = 3;
    const cardsToDisplay = [];
    for (let i = 0; i < amountCardsToSelect; i++) {
      const randomIndex = Math.ceil(Math.random() * blackCards.length - 1);
      cardsToDisplay.push({
        card: blackCards[randomIndex],
        index: randomIndex,
      });
    }
    return setshowBlackCards((prev) => [...cardsToDisplay]);
  };

  //select a black card and send to team
  const selectCard = ({ index, element, event }) => {
    //update all black cards
    if (index) {
      const [selected] = blackCards.splice(index, 1);

      setBlackCards(() => [...blackCards]);
      setActiveIndex(index);
      setTimeout(() => {
        setshowBlackCards(null);
        chooseBlackCard(selected);
      }, 1500);
      return;
    }
    //choose random card and set player inactive
    chooseBlackCard(null);
    return;
  };

  useEffect(() => {
    randomBlackCards();
  }, []);

  {
  }

  if (!showBlackCards || gameStage !== "black") return;

  return (
    <section className="czarSelectionContainer">
      <div>
        <h1 className="czarPickingH1">You are the Czar!!!</h1>
        <h2>Select a Card </h2>
      </div>
      <div>
        <ul
          className="czarPickingContainer"
          style={styles}
          ref={czarPickingContainerRef}
        >
          {showBlackCards &&
            showBlackCards.map((cardItem, blackIndex) =>
              cardItem.index === activeIndex ? (
                <m.li
                  key={cardItem.card.text + blackIndex}
                  data-index={cardItem.index}
                  initial={
                    blackIndex === (showBlackCards.length - 1) / 2
                      ? {
                          top: "30%",
                          left: "43%",
                        }
                      : blackIndex === showBlackCards.length - 1
                      ? { top: "30%", left: "58%" }
                      : { top: "30%", left: "28%" }
                  }
                  animate={{
                    top: "50%",
                    left: "50%",
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: 1,
                    scale: 2.2,
                    rotate: 360,
                    position: "fixed",
                  }}
                  transition={{ duration: 0.3 }}
                  className={
                    blackIndex === (showBlackCards.length - 1) / 2
                      ? "middle"
                      : blackIndex === showBlackCards.length - 1
                      ? "highest"
                      : "lowest"
                  }
                >
                  <div
                    key={cardItem.card.text + blackIndex}
                    className={` ${style.black} czarPicking`}
                    onClick={(e) => {
                      selectCard({
                        index: cardItem.index,
                        event: e,
                      });
                    }}
                  >
                    {cardItem.card.text}
                  </div>
                </m.li>
              ) : (
                <li key={cardItem.card.text + blackIndex}>
                  <div
                    className={` ${style.black} czarPicking`}
                    onClick={(e) => {
                      selectCard({
                        index: cardItem.index,
                        event: e,
                      });
                      setScrollLeftandRight(0);
                    }}
                  >
                    {cardItem.card.text}
                  </div>
                </li>
              )
            )}
        </ul>
        <button className="czarButtonLeft" onClick={handleScrollLeft}>
          <FaChevronLeft />
        </button>
        <button className="czarButtonRight" onClick={handleScrollRight}>
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default Czar;
