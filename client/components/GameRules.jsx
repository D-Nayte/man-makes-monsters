import React from "react";
import { CgCloseO } from "react-icons/cg";

function GameRules({ setShowRules, showRules }) {
  if (!showRules) return;
  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <button onClick={() => setShowRules(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>
        <h2>Game Rules</h2>
        <div className="gameRulesText">
          <div>
            <p>
              Man Makes Monster is a Cards Against Humanity replica. It is a
              party game in which players complete fill-in-the-blank statements
              using words or phrases typically deemed as offensive, risqué or
              politically incorrect printed on playing cards. The game is simple
              to play, but can be highly entertaining and irreverent.
            </p>
            <p>
              Note: The game can be played with any number of players and it is
              recommended for players aged 17 and over.
            </p>
          </div>
          <ol>
            Here are the rules for playing the game:
            <li>
              Each round, one player (the "Card Czar") will draw a black card,
              which contains a fill-in-the-blank statement.
            </li>
            <li>
              The other players will each select a white card from their hand
              that they think best completes the statement on the black card.
            </li>
            <li>
              The Card Czar will then read each of the selected white cards
              aloud, and choose the funniest or most fitting response. The
              player who submitted the chosen white card will be awarded a
              point.
            </li>
            <li>
              Play continues with a new Card Czar and a new black card until the
              players decide to end the game.
            </li>
            <li>
              The player with the most points at the end of the game is the
              winner.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default GameRules;
