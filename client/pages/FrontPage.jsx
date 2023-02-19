import React from "react";
import { useSpring, animated } from "react-spring";
import Link from "next/link";
import { motion as m } from "framer-motion";

const calc = (x, y) => [
  -(y - window.innerHeight / 2) / 20,
  (x - window.innerWidth / 2) / 20,
  1.1,
];
const trans = (x, y, s) =>
  `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

function FrontPage() {
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 10, tension: 200, friction: 50 },
  }));

  return (
    <>
      <m.div
        className="pageTransition"
        exit={{
          x: -1300,
          opacity: 1,
          rotate: -120,
          transition: { duration: 0.6 },
        }}>
        <Link href="/home" className="linkElement">
          <animated.div
            className="cardContainer"
            onMouseMove={({ clientX: x, clientY: y }) =>
              set.current[0].start({ xys: calc(x, y) })
            }
            onMouseLeave={() => set.current[0].start({ xys: [0, 0, 1] })}
            style={{ transform: props.xys.to(trans) }}>
            <div className="card">
              <div className="cardFace cardFace--front">
                <h2>Man Makes Monster.</h2>
                <div className="playPulseContainer">
                  <h3>Press to Play</h3>
                </div>
              </div>
            </div>
          </animated.div>
        </Link>
      </m.div>
    </>
  );
}

export default FrontPage;
