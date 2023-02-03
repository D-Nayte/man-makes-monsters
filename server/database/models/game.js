import mongoose from "mongoose";

const gameModel = mongoose.Schema(
  {
    id: { type: String, index: true }, // same as `${lobbyid} `
    gameIdentifier: { type: Number, index: true }, // 0 = first, 1 second, 2 = third
    setRounds: Number, //amount of rounds to be played. should be a multitude of n-players
    handSize: Number, //amount of maximum white cards per player
    concluded: Boolean, //initial false
    players: [
      // this array gets taken from lobby, then gets scrambled.
      {
        id: String, // this.Lobby.player[n].id
        name: String,
        bet: Boolean, // default false. FEATURE!
        inactive: Boolean, // whenever timer runs out and player hasn't made their move, this will turn true, until cancelled
        points: Number, //default zero, every round won adds a point.
        hand: Array, //just white Cards
        isHost: Boolean,
        avatar: Object,
      },
    ],
    deck: {
      black_cards: Array, // if [] blow up the game and show credits. FEATURE!
      white_cards: Array, // if [] blow up the game and show credits. FEATURE!
    },
    turns: [
      {
        turn: Number, // the turn identifier
        czar: Object, // this.Game.players[n]
        stage: [
          "start", // scramble and pushes player array to game, switch clients go game page,
          "dealing", // gives players up to {handSize} cards, selects starting point in array op players for Czar election
          "black", // black card gets picked.random, save to turn object, if (!rejected) continue. if(rejected){repeat}
          "white", // black card gets displayed, timer-start triggers, players pick their cards by submit, {white_cards} get saved, timer-end triggers
          "deciding", // all {white_cards.played_card} gets displayed for Czar, they pick winner by submit. {winner} gets saved.
          "winner", // {winner} is displayed, timer-start triggers,  awarded points, dealing(n),timer-end triggers
          "scoreboard", // Display score per player in decending order, amount of rounds. timer to go back to lobby? 10 min?
        ], // game progresses left-to-right, loops at "winner" back to "election". having added a "dealing" function at "winner" stage
        white_cards: [
          {
            player: String,
            cards: Array,
            played_card: [Object],
            points: Number,
          },
        ], //this.Game.players(n).id; this.Game.players(n).hand, this.Game.players(n).hand.splice(n, 1)
        black_card: Object, //this.Game.deck.black_cards.(splice(math.random, 1)) ()=> remove from black_cards array to prevent repeats
        winner: {
          player: String,
          cards: Array,
          played_card: [Object],
          points: Number,
        }, // same as white_cards, except just an Object rather than an Array of Objects.
        completed: [Object],
      },
    ],
    timerTrigger: Boolean, // Set and started by host, start is synced, finish is pushed by host's timer
  },

  {
    timestamps: true,
  }
);
export default mongoose.model("GameCollection", gameModel);
