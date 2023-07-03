import React from "react";

export default function Message({currentUser,sendby,time,message}){
    return(
        <>
            {currentUser===sendby.name ? 
            (
                <div className="sent-message">
                    <div className="msg">{message}</div>
                </div>
            ):(
                <div className="received-message">
                    <div>{sendby.name}</div>
                    <div className="msg">{message}</div>
                </div>
            )}
        </>
    )
}