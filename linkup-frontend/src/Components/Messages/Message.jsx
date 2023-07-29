import React, { useEffect, useState,useRef } from "react";

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
  const ref=useRef()
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})

  },[message])

  return (
    
    <>
      {currentUser === sendby.name ? (
        <div className="sent-message" ref={ref}>
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
