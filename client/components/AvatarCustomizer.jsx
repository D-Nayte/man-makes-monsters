import React, { useRef, useEffect } from "react";
import { avataaars } from "@dicebear/collection";
import { CgCloseO } from "react-icons/cg";
import hexColors from "../utils/hexCodes";

const AvatarCustomizer = ({
  handleSetAvatarOptions,
  setShowSettings,
  children,
  currGameId,
}) => {
  const avaProps = avataaars.schema.properties;
  const settingsWrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        !settingsWrapperRef.current.contains(e.target) &&
        !e.target.closest(".avatar-image")
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {
        <div className="settings-wrapper" ref={settingsWrapperRef}>
          {children}
          {!currGameId && (
            <ul className="avata-settings">
              {Object.entries(avaProps)
                .filter(
                  (entry) =>
                    entry[1].type !== "integer" &&
                    entry[1].description != "@deprecated" &&
                    entry[1].default.length > 1
                )
                .map((entry, index) => {
                  const optionList = entry[1].default;
                  const title = entry[0];
                  const value = entry[1].items;
                  entry;
                  return (
                    <li key={entry[1] + index}>
                      <h3>{title}</h3>

                      <select
                        onChange={(e) =>
                          handleSetAvatarOptions(e.target.value, entry[0])
                        }
                      >
                        {(entry[0] === "accessories" ||
                          entry[0] === "facialHair") && (
                          <option value="none">none</option>
                        )}
                        {optionList &&
                          optionList.map((option) => {
                            return (
                              <option
                                propertie={entry[0]}
                                value={option}
                                key={option}
                              >
                                {title.toLocaleLowerCase().includes("color")
                                  ? hexColors[option]
                                  : option}
                              </option>
                            );
                          })}
                      </select>
                    </li>
                  );
                })}
            </ul>
          )}
          <button onClick={() => setShowSettings(false)}>
            <CgCloseO />
          </button>
        </div>
      }
    </>
  );
};

export default AvatarCustomizer;
