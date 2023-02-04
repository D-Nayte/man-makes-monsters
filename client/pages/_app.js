import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/layout";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { ContextWrapper } from "../context";

export const socket = io("https://man-makes-monsters-servr.onrender.com", {
  reconnection: true, // enable reconnection
  reconnectionAttempts: 5, // try to reconnect 5 times
  reconnectionDelay: 3000, // increase the delay between reconnection attempts to 3 seconds
});

function MyApp({ Component, router, pageProps: { session, ...pageProps } }) {
  const cookies = parseCookies();
  const [amountOfRounds, setAmountOfRounds] = useState(10);
  const [handSize, setHandSize] = useState(10);
  const [language, setLanguage] = useState("english");

  useEffect(() => {
    if (socket.id && !cookies.socketId)
      setCookie(null, "socketId", socket.id, { path: "/" });
  }, [socket.id]);

  useEffect(() => {
    socket.emit("cachUser", { cookieId: cookies.socketId });
  }, [cookies.socketId]);

  const consoleMessage = () => {
    console.log(
      "%cWant to know how we did it? %cAsk us %cAndy Schunke LinkedIn: https://www.linkedin.com/in/andy-schunke/ %cDanni Malka LinkedIn: https://www.linkedin.com/in/danni-malka-58a5b1117/ %cChristiaan Klingsporn LinkedIn: https://www.linkedin.com/in/cklingsporn/ %cElizabeth (Liz) Czarny LinkedIn: https://www.linkedin.com/in/elizabeth-czarny/",
      "padding: 50px 20% 10px 20%; color: white; font-family: Arial; font-size: 4em; font-weight: bolder; text-shadow: #000 5px 5px; background: black;",
      "padding: 10px 45% 10px 50%; color: white; font-family: Arial; font-size: 1.5em; font-weight: normal; text-shadow: #000 1px 1px; background: black; width: 100%;",
      "background: black; padding: 50px 30% 10px 30%;",
      "background: black; padding: 10px 30% 10px 30%;",
      "background: black; padding: 10px 30% 10px 30%;",
      "background: black; padding: 10px 30% 50px 30%;"
    );
  };

  useEffect(() => {
    consoleMessage();
  }, []);

  return (
    <ContextWrapper>
      <SessionProvider session={session}>
        <Layout
          socket={socket}
          setHandSize={setHandSize}
          setAmountOfRounds={setAmountOfRounds}
          handSize={handSize}
          amountOfRounds={amountOfRounds}
          language={language}
          setLanguage={setLanguage}>
          <AnimatePresence mode="wait" initial={false}>
            <Component
              key={router.pathname}
              {...pageProps}
              handSize={handSize}
              amountOfRounds={amountOfRounds}
              socket={socket}
              language={language}
            />
            ;
          </AnimatePresence>
        </Layout>
      </SessionProvider>
    </ContextWrapper>
  );
}

export default MyApp;
