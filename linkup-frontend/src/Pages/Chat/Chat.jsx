import React, { useState, useEffect } from "react";
import "./Chat.css";
import Cookies from "js-cookie";
import io from "socket.io-client";
import Message from "../../Components/Messages/Message";
import axios from 'axios';
import SimpleCrypto from 'simple-crypto-js';
  
export default function Chat() { 
  const [friendslist, setfriendslist] = useState([]);
  const [active, setactive] = useState(null);
  const [message, setmessage] = useState("");
  const [messagelist, setmessagelist] = useState([]);
  const [friendactive, setfriendactive] = useState();
  const [onlineFriends,setOnlineFriends] = useState([]);
  const [socket, setSocket] = useState(null);
  const cookies = Cookies.get("linkup-login");
  const currentuser = friendslist.find((user) => user.email === cookies);
  const username = "Current User";
  const secretKey = process.env.REACT_APP_CRYPTO_SECRET;
  const crypto = new SimpleCrypto(secretKey);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://linkup-backend-k05n.onrender.com/user/getallusers");
        setfriendslist(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []); 

   useEffect(() => {

    const getcookies = Cookies.get('linkupdata')
    const userData = crypto.decrypt(getcookies);

    const socket = io.connect("https://linkup-backend-k05n.onrender.com");
    setSocket(socket);

    socket.emit("initialData",userData);

    socket.on("initialData",(onlinePeople)=>{
      setOnlineFriends([...onlinePeople]);
    })
    socket.on("online",(data)=>{
      console.log(data.name+" is online");
      if(!onlineFriends.includes(data.email)){
        setOnlineFriends([...onlineFriends,data.email]);
      }
    })

    socket.on("offline",(data)=>{
      const temp=[...onlineFriends];
      temp.splice(data.email,1);
      setOnlineFriends(temp);
      console.log(data.name+" is offline");
    })
    
    socket.on("recieve-message", (data) => { 
        console.log("Mesage recieved",data)
        setmessagelist((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);  

  function sendmessage() {
    console.log("Online People Are :");
    console.log(onlineFriends);
    /* const time = new Date();
    console.log(`Friend active is ${friendactive}`)
    const recipientEmail = friendactive;

    socket.emit("send-message", {
        sendby:currentuser.email,
        sendto:recipientEmail,
        message,
        time,
    });

    setmessage(""); */
  }

  function handlefriendsclick(friend, index) {
    setactive(index);
    setfriendactive(friend.email);
    console.log(`Friend active is`,friend)
  }

  return (
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
              {friendslist.map((friend,index)=>(
                  <div 
                      className={`friends-outer ${index === active ? "active" : ""}`}
                      onClick={()=>{handlefriendsclick(friend,index)}}
                      key={index}>
                      {friend.name}
                      <div className={`${onlineFriends.includes(friend.email) && "online"}`}></div>
                  </div>  
              ))}
          </div>
        <div className="chat-interface-outer">
          <h1>{friendactive}</h1>
          <div className="chat-interface">
            <div className="chat-messages">
              {messagelist.map((data, key) => (
                <Message
                  username={currentuser.name}
                  sendby={data.sendby}
                  time={data.time}
                  message={data.message}
                  key={key}
                />
              ))}
            </div>
            <div className="message-input-outer">
              <input
                type="text"
                className="message-input"
                value={message}
                onChange={(e) => {
                  setmessage(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendmessage();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
