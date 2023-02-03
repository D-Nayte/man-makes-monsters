import React, { useEffect, useState } from "react";

function random(num) {
  return Math.floor(Math.random() * num);
}

function getRandomStyles() {
  let mt = random(200);
  let ml = random(20);
  let dur = random(8) + 8;
  let halfChance = random(2);
  let delay = random(5);
  if (halfChance === 0) {
    return {
      backgroundColor: `white`,
      color: `white`,
      boxShadow: `inset -7px -3px 10px #242424b2`,
      margin: `${mt}px 0 0 ${ml}px`,
      animation: `float ${dur}s linear  infinite`,
    };
  } else {
    return {
      backgroundColor: `red`,
      color: `red`,
      boxShadow: `inset -7px -3px 10px rgba(255,255,255,0.7)`,
      margin: `${mt}px 0 0 ${ml}px`,
      animation: `float ${dur}s linear infinite`,
    };
  }
}

function BalloonContainer(props) {
  const { totalBaloon = 15 } = props;
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    createBalloons(totalBaloon);
  }, []);

  function createBalloons(num) {
    for (let i = num; i > 0; i--) {
      setBalloons((prevBalloons) => [
        ...prevBalloons,
        <div
          key={getRandomStyles().margin + i}
          className="balloon"
          style={getRandomStyles()}
        />,
      ]);
    }
  }

  return <div id="balloon-container">{balloons}</div>;
}

export default BalloonContainer;
