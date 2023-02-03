import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useRouter } from "next/router";

const calc = (x, y) => [
  -(y - window.innerHeight / 2) / 20,
  (x - window.innerWidth / 2) / 20,
  1.1,
];
const trans = (x, y, s) =>
  `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

function PageNotFound() {
  const router = useRouter();
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 10, tension: 200, friction: 50 },
  }));

  return (
    <>
      <div className="linkElement">
        <animated.div
          className="cardContainer"
          onMouseMove={({ clientX: x, clientY: y }) =>
            set.current[0].start({ xys: calc(x, y) })
          }
          onMouseLeave={() => set.current[0].start({ xys: [0, 0, 1] })}
          style={{ transform: props.xys.to(trans) }}
        >
          <div className="card">
            <div className="cardFace cardFace--front">
              <h2>Page Not Found.</h2>
            </div>
            <div className="pageNotFoundButton">
              <button onClick={() => router.push("/")}>Back Home</button>
            </div>
          </div>
        </animated.div>
      </div>
    </>
  );
}

export default PageNotFound;
