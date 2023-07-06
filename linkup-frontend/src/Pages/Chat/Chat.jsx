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
  const [messagelist, setMessageList] = useState([]);
  const [friendactive, setfriendactive] = useState([]);
  const [onlineFriends,setOnlineFriends] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState();

  const secretKey = process.env.REACT_APP_CRYPTO_SECRET || "DUMMYVALUE";
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
    if(friendslist.length){
      setfriendactive(friendslist[0]);
    }
  }, [friendslist]);

   useEffect(() => {
    const getcookies = Cookies.get('linkupdata')
    const temp = crypto.decrypt(getcookies);
    
    const socket = io.connect("https://linkup-backend-k05n.onrender.com");
    socket.on('connect', () => {
      const socketID = socket.id;   
      setSocket(socket);
      setCurrentUser({...temp,socketID});
      //socket.emit("initialData",currentUser);
    });

    socket.on("online-people",(onlinePeople)=>{
      setOnlineFriends(onlinePeople);
    })

    socket.on("recieve-message",(messageData)=>{
      setMessageList(prev => [...prev,messageData]);
      //console.log(currentUser);
//      console.log(updatedCurrentUser);
    })

    return () => {
      socket.disconnect();
    };
  }, []);  

  useEffect(()=>{
    if(currentUser){
      console.log(currentUser);
      socket.emit("initialData",currentUser);
    }
  },[currentUser])

  function sendmessage() {

    const time = new Date();
    console.log(`Current user is`,currentUser);

    socket.emit("send-message", {
        sendby:currentUser,
        sendto:friendactive,
        message,
        time,
    });

    setmessage(""); 
  }

  function handlefriendsclick(friend, index) {
    setactive(index);
    setfriendactive(friend);
    setMessageList([]);
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
          <h1>{friendactive.name}</h1>
          <div className="chat-interface">
            <div className="chat-messages">
              {messagelist.map((data, key) => (
                <Message
                  currentUser={currentUser.name}
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
