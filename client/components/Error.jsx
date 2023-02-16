import React, { useState } from "react";

const Error = ({ showErrMessage, setShowErrMessage, success }) => {
  if (!showErrMessage && !success) return;
  const [isRunning, setIsRunning] = useState(false);
  if (!isRunning) {
    setIsRunning(true), setTimeout(() => setShowErrMessage(false), 5000);
  }

  return (
    <div
      className="errMessage"
      style={
        success
          ? { backgroundColor: "#a0d68ad3" }
          : { backgroundColor: "#eb455f" }
      }>
      {showErrMessage && showErrMessage.length <= 0 && !success
        ? "Something went wrong!"
        : success
        ? success
        : showErrMessage}
    </div>
  );
};

export default Error;
