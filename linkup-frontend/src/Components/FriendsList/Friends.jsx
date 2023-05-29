import React, { useState } from "react";
import "./Friends.css";

export default function Friends({ name,index,active,setactive }){

    function handleclick(){
        setactive(index);
        console.log(active);
    }

    return(
        <>
            <div 
                className={`friends-outer ${index === active ? "active" : ""}`}
                onClick={handleclick}>

                {index}{name}
            </div>
        </>
    )
}