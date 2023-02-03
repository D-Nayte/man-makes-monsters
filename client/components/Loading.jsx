import React from "react";

function Loading() {
  return (
    <div className="loadingScreenContainer">
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h2>Loading</h2>
    </div>
  );
}

export default Loading;
