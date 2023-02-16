import React, { useEffect, useState } from "react";
import { signOut, getProviders, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { BsBug, BsFillChatRightTextFill } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { BsCardChecklist } from "react-icons/bs";
import { AiOutlineDollarCircle, AiOutlineMail } from "react-icons/ai";
import { getMails, getuserProfileDetails } from "../utils/fetchCalls.js";
import Settings from "./Settings";
import { useAppContext } from "../context";
import Error from "./Error";
import GameRules from "./GameRules";
import ReportBug from "./ReportBug";
import Contact from "./Contact";
import { BiLogOut } from "react-icons/bi";
import Profile from "./Profile";
import SignIn from "../pages/api/auth/SignIn";
import Background from "./Background";
import AdminMail from "./AdminMail";
import Userprofile from "./UserProfile";
import { patchUserProfile } from "../utils/patchProfile.js";
import allCardBackgrounds from "../public/assets/cardpictures/index.js";
import allBackgrounds from "../public/assets/backgrounds/index.js";

function Navbar(props) {
  const {
    socket,
    setHandSize,
    setAmountOfRounds,
    handSize,
    amountOfRounds,
    language,
    setLanguage,
  } = props;
  const [providers, setProviders] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showBug, setShowBug] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showMail, setShowMail] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const { data: session } = useSession();
  const { storeData, setStoreData } = useAppContext();
  const [showErrMessage, setShowErrMessage] = useState(false);
  const router = useRouter();
  const [selectedCardBackground, setSelectedCardBackground] = useState("");
  const [selectedBackground, setSelectedBackground] = useState("");
  const [lobbyId, setLobbyId] = useState(null);
  const cookies = parseCookies();
  const [gameIdentifier, setGameIdentifier] = useState(null);
  const [storedMailData, setStoredMailData] = useState(null);
  const backToLobby = (e) => {
    e.stopPropagation();
    if (lobbyId) {
      const playerData = {
        playerId: cookies.socketId,
        lobbyId,
        gameId: lobbyId,
        leavedGame: true,
      };

      socket.removeAllListeners();
      socket.emit("changeGame", playerData);
      router.push({
        pathname: `/lobby/${lobbyId}`,
      });
    }
  };

  const handleDonate = () => {
    window.open(
      "https://www.paypal.com/donate/?hosted_button_id=GYX5SR7ZTMGQA",
      "_blank",
      "height=500px,width=500px"
    );
  };

  useEffect(() => {
    if (socket) {
      socket.on("disconnect", (reason) => {
        setGameIdentifier;
        setShowErrMessage(
          "Server connection lost! Please reload or go back to Hompage"
        );
      });

      socket.io.on("reconnect", () => {
        setShowErrMessage(false);
        setSuccessMessage("Successfully reconnected to Server");
        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      });
    }

    if (router.query.lobbyId && router.query.gameId) {
      setGameIdentifier(router.query.gameId[0]);
      setLobbyId(router.query.lobbyId);
    }

    if (!router.query.lobbyId) {
      setLobbyId(null);
    }

    if (Array.isArray(router.query.lobbyId)) {
      setGameIdentifier(null);
      return setLobbyId(router.query.lobbyId[0]);
    }
  }, [router.isReady, router, socket]);

  useEffect(() => {
    !providers &&
      (async () => {
        let providers = await getProviders();
        setProviders(providers);
      })();
  }, []);

  useEffect(() => {
    // fetch calls
    if (session) {
      (async () => {
        const mails = await getMails(session);
        setStoredMailData(mails);

        const profile = await getuserProfileDetails(session);
        setStoreData((prev) => ({ ...prev, profile }));
      })();
    } else if (!session) {
      // delete all states after logout
      setStoredMailData(null);
      delete storeData.profile;
      setStoreData((prev) => ({ ...storeData }));
      destroyCookie(null, "token", { path: "/" });
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      patchUserProfile({
        key: "favoritecard",
        value: selectedCardBackground.label,
      });
    }
    setStoreData((prev) => ({ ...prev, selectedCardBackground }));
  }, [selectedCardBackground]);

  useEffect(() => {
    if (session) {
      patchUserProfile({
        key: "favoritebackground",
        value: selectedBackground.label,
      });
    }
    setStoreData((prev) => ({ ...prev, selectedBackground }));
  }, [selectedBackground]);

  useEffect(() => {
    if (storeData?.profile) {
      //default value for cardBackground after log in
      if (storeData.selectedCardBackground === "") {
        const cardKey = storeData.profile.favoritecard;

        const card = allCardBackgrounds.find((card) => card.label === cardKey);

        card &&
          setStoreData((prev) => ({
            ...prev,
            selectedCardBackground: card,
          }));
      }

      //default value for global Background after log in
      if (storeData.selectedBackground === "") {
        const backgroundKey = storeData.profile.favoritebackground;

        const backGround = allBackgrounds.find(
          (background) => background.label === backgroundKey
        );
        backGround &&
          setStoreData((prev) => ({
            ...prev,
            selectedBackground: backGround,
          }));
      }
    }
  }, [storeData?.profile, session]);

  return (
    <>
      <nav className="navContainer">
        {lobbyId && !gameIdentifier && (
          <img
            src="/MMM-logo.svg"
            alt="MMM Logo"
            onClick={() => router.push("/")}
          />
        )}
        {lobbyId && gameIdentifier && (
          <h2 className="backButton">
            <button onClick={backToLobby}>
              <IoIosArrowBack />
            </button>
          </h2>
        )}
      </nav>
      <div
        className="accountMenu"
        onMouseLeave={() => {
          setShowProfile(false);
          setShowSettings(false);
        }}>
        <button className="burgerMenue"></button>
        <ul>
          {session ? (
            <>
              <li id="sidebar-item">
                <div
                  id="settingsToggle"
                  onClick={() => setShowProfile((prev) => !prev)}>
                  <div className="navbarProfilePic joyRideProfile">
                    <img
                      className="navIcon"
                      src={session.user.image}
                      alt={session.user.name}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="navBarText">
                    {session.user.name}
                    <span
                      className={
                        showProfile
                          ? "arrowDownIcon "
                          : "arrowDownIcon openArrow"
                      }>
                      <IoIosArrowDown />
                    </span>
                  </div>
                </div>
              </li>
              <li id={showProfile ? "openSettings" : "closeSettings"}>
                <ul className="settingsInputContainer ">
                  <li
                    className="profileMenu "
                    onClick={() => {
                      setShowProfile((prev) => !prev);
                      setShowUserProfile(true);
                    }}>
                    Profile
                  </li>
                  <li
                    className="profileMenu "
                    onClick={() => {
                      setShowProfile((prev) => !prev);
                      setShowProfileMenu(true);
                    }}>
                    Card Backside
                  </li>
                  <li
                    className="profileMenu "
                    onClick={() => {
                      setShowProfile((prev) => !prev);
                      setShowBackground(true);
                    }}>
                    Backgrounds
                  </li>
                  {router.pathname !== "/lobby/game/[...gameId]" ? (
                    <li className="profileMenu" onClick={signOut}>
                      <span className="profileMenuIcon">
                        <BiLogOut />
                      </span>
                      Sign out
                    </li>
                  ) : (
                    <li className="profileMenu">
                      <span className="profileMenuIcon">
                        <BiLogOut />
                      </span>
                      Can't Sign out during a game
                    </li>
                  )}
                </ul>
              </li>
            </>
          ) : (
            <li
              className={"signIn joyRideProfile"}
              style={gameIdentifier ? { color: "gray", opacity: ".7" } : null}
              onClick={!gameIdentifier ? () => setShowSignIn(true) : null}>
              <div className="navbarIcons">
                <CgProfile />
              </div>
              <div className="navBarText">
                {gameIdentifier ? "Can't sing in during a game" : "Sign In"}
              </div>
            </li>
          )}

          {lobbyId && !gameIdentifier && storeData?.isHost ? (
            <>
              <li id="sidebar-item">
                <div
                  id="settingsToggle"
                  onClick={() => setShowSettings((prev) => !prev)}>
                  <div className="navbarIcons gameSettingsIcon">
                    <FiSettings />
                  </div>
                  <div className="navBarText">
                    Settings
                    <span
                      className={
                        showSettings
                          ? "arrowDownIcon "
                          : "arrowDownIcon openArrow"
                      }>
                      <IoIosArrowDown />
                    </span>
                  </div>
                </div>
              </li>
              <li id={showSettings ? "openSettings" : "closeSettings"}>
                <Settings
                  showSettings={showSettings}
                  setShowSettings={setShowSettings}
                  setHandSize={setHandSize}
                  setAmountOfRounds={setAmountOfRounds}
                  handSize={handSize}
                  language={language}
                  setLanguage={setLanguage}
                  amountOfRounds={amountOfRounds}
                />
              </li>
            </>
          ) : (
            <li style={{ color: "grey" }}>
              <div className="navbarIcons">
                <FiSettings />
              </div>
              <div className="navBarText">Settings</div>
            </li>
          )}

          <li onClick={() => setShowBug(true)}>
            <div className="navbarIcons">
              <BsBug />
            </div>
            <div className="navBarText">Report a Bug</div>
          </li>
          <li onClick={handleDonate}>
            <div className="navbarIcons">
              <AiOutlineDollarCircle />
            </div>
            <div className="navBarText">Buy us Coffee</div>
          </li>
          <li onClick={() => setShowRules(true)}>
            <div className="navbarIcons">
              <BsCardChecklist />
            </div>
            <div className="navBarText">Game Rules</div>
          </li>
          <li onClick={() => setShowContact(true)}>
            <div className="navbarIcons">
              <AiOutlineMail />
            </div>
            <div className="navBarText">Contact us</div>
          </li>
          {session && storedMailData && (
            <li onClick={() => setShowMail(true)}>
              <div className="navbarIcons">
                <BsFillChatRightTextFill />
              </div>
              <div className="navBarText">Admin mail</div>
            </li>
          )}
        </ul>
        <p className="copyright">
          Copyright © 2023 Man Makes Monster. All rights reserved.
        </p>
        {providers && (
          <SignIn
            providers={providers}
            showSignIn={showSignIn}
            setShowSignIn={setShowSignIn}
            className="gameRulesContent"
          />
        )}

        <Userprofile
          showUserProfile={showUserProfile}
          setShowUserProfile={setShowUserProfile}
          className="gameRulesContent"
        />

        <Profile
          selectedCardBackground={selectedCardBackground}
          setSelectedCardBackground={setSelectedCardBackground}
          setShowProfileMenu={setShowProfileMenu}
          showProfileMenu={showProfileMenu}
          className="gameRulesContent"
        />
        <Background
          selectedBackground={selectedBackground}
          setSelectedBackground={setSelectedBackground}
          showBackground={showBackground}
          setShowBackground={setShowBackground}
          className="gameRulesContent"
        />
        <ReportBug
          setShowBug={setShowBug}
          showBug={showBug}
          setSuccessMessage={setSuccessMessage}
          setShowErrMessage={setShowErrMessage}
          className="gameRulesContent"
        />
        <GameRules
          setShowRules={setShowRules}
          showRules={showRules}
          className="gameRulesContent"
        />
        <Contact
          setShowContact={setShowContact}
          setSuccessMessage={setSuccessMessage}
          setShowErrMessage={setShowErrMessage}
          showContact={showContact}
          className="gameRulesContent"
        />
        {showMail && (
          <AdminMail
            setShowMail={setShowMail}
            storedMailData={storedMailData}
            className="gameRulesContent"
          />
        )}
      </div>
      <Error
        showErrMessage={showErrMessage}
        setShowErrMessage={setShowErrMessage}
        success={successMessage}
      />
    </>
  );
}

export default Navbar;
