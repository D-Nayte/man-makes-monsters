import cardDecks from "../data/allCards.json" assert { type: "json" };

export const formatCardData = () => {
  const formatted = cardDecks.map((cardDeck) => {
    const { name, white, black } = cardDeck;
    cardDeck.white = white.map((card) => {
      card.deck = name;
      return card;
    });
    cardDeck.black = black.map((card) => {
      card.deck = name;
      return card;
    });
    return cardDeck;
  });
  return formatted;
};
