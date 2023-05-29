import React, { useState } from "react";
import "./Chat.css"
import Friends from "../../Components/FriendsList/Friends";

export default function Chat(){

    const [friendslist,setfriendslist]=useState(["Arpit1","Arpit2","Arpit3","Arpit4","Arpit5","Arpit6","Arpit7"]);
    const [active, setactive] = useState(null);

    return(
        <>
            <div className="outer">
                <div className="friends-list-outer">
                    <div className="friends-list-upper">
                        <div className="add-new-btn">
                            Add New
                        </div>
                        <div className="friends-list-title">
                            <h1>Chat</h1>
                            <div className="search-bar">
                                <input type="text"/>
                            </div>
                        </div>
                    </div>
                    {friendslist.map((names,index)=>(
                        <Friends 
                            name={names}
                            key={index}
                            index={index}
                            active={active}
                            setactive={setactive}
                        />
                    ))}

                </div>
                <div className="chat-interface-outer"></div>
            </div>
        </>
    )
}