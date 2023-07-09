import React, { useEffect, useState } from "react";

export default function Message({ currentUser, sendby, time, message }) {
  function convert(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const timeIST = date.toLocaleString("en-US", options);

    return timeIST;
  }

  return (
    <>
      {currentUser === sendby.name ? (
        <div className="sent-message">
          <div className="msg" style={{ maxWidth: "20vw" }}>{message}</div>
          <div className="time">{convert(time)}</div>
        </div>
      ) : (
        <div className="received-message">
          <div className="msg">{message}</div>
          <div className="time">{convert(time)}</div>
        </div>
      )}
    </>
  );
}
