import React from "react";

export default function Message({username,sendby,time,message}){
    return(
        <>
            {username===sendby ? 
            (
                <div className="sent-message">
                    <div className="msg">{message}</div>
                </div>
            ):(
                <div className="received-message">
                    <div>{username}</div>
                    <div className="msg">{message}</div>
                </div>
            )}
        </>
    )
}