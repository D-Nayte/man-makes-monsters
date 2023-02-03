const dealCards = ({ currentGame, playerId }) => {
  if (currentGame.turns[0].stage.includes("dealing")) return;

  //deal random white cards to players
  currentGame.players = currentGame.players.map((player) => {
    const playerhand = [];
    const handsize = currentGame.handSize;

    for (let counter = handsize; counter > 0; counter--) {
      const deckLength = currentGame.deck.white_cards.length - 1;
      const randomIndex = Math.floor(Math.random() * deckLength);
      const [randomCard] = currentGame.deck.white_cards.splice(randomIndex, 1);
      playerhand.push(randomCard);
    }
    player.hand = playerhand;
    return player;
  });

  //setup the first random czar
  const randomIndex = Math.floor(
    Math.random() * (currentGame.players.length - 1)
  );
  const randomPlayer = currentGame.players[randomIndex];
  currentGame.turns[0].czar = randomPlayer;

  //add player to turn
  const foundPlayer = currentGame.turns[0].white_cards.find(
    (player) => player.player === playerId
  );
  if (!foundPlayer) {
    currentGame.players.forEach((player) => {
      if (player.id !== randomPlayer.id)
        currentGame.turns[0].white_cards.push({
          player: player.id,
          cards: player.hand,
          played_card: [],
          points: 0,
          active: true,
        });
    });
  }
  //activate timer trigger
  currentGame.timerTrigger = true;

  let currentStage = currentGame.turns[0].stage;
  currentGame.turns[0].stage = [...currentStage, "dealing", "black"];
  return currentGame;
};
export default dealCards;
