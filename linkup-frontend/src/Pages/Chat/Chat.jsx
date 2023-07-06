import React, { useState, useEffect } from "react";
import "./Chat.css";
import Cookies from "js-cookie";
import io from "socket.io-client";
import Message from "../../Components/Messages/Message";
import axios from 'axios';
import SimpleCrypto from 'simple-crypto-js';

const RenderFriendList = ({ friendsList, active, onlineFriends, handleFriendsClick }) => (
  <>
    {console.log("inside component ",friendsList?.length)}
    {/* {friendsList.map((friend, index) => (
      <div
        className={`friends-outer ${index === active ? "active" : ""}`}
        onClick={() => {
          handleFriendsClick(friend, index);
        }}
        key={index}
      >
        {friend.name}
        <div
          className={`${onlineFriends.includes(friend.email) && "online"}`}
        ></div>
      </div>
      ))} */}
  </>
);

export default function Chat() {
  const [friendsList, setFriendsList] = useState([]);
  const [filterFriendList, setFilterFriendList] = useState([]);
  const [active, setActive] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [friendActive, setFriendActive] = useState();
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [searchState, setSearchState] = useState("");
  
  const secretKey = process.env.REACT_APP_CRYPTO_SECRET;


  const crypto = new SimpleCrypto(secretKey);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://linkup-backend-k05n.onrender.com/user/getallusers"
        );
        setFriendsList(response.data);
        setFilterFriendList(response.data);
        //console.log(friendsList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

/*   useEffect(()=>{
    if(friendsList.length)
      console.log(friendsList);
  },[friendsList]) */

  useEffect(() => {
    //console.log(filterFriendList);
    if(filterFriendList.length){
      setFriendActive(filterFriendList[0]);
      //console.log(filterFriendList);
    }
  }, [filterFriendList]);

   useEffect(() => {
    const getcookies = Cookies.get('linkupdata')
    const temp = crypto.decrypt(getcookies);

    const socket = io.connect("http://localhost:3001");
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

  useEffect(() => {
    if (searchState) {
      const filteredList = friendsList.filter((friend) =>
        friend.name.toLowerCase().includes(searchState.toLowerCase())
      );
      setFilterFriendList(filteredList);
    }

    return () => setFilterFriendList([])
  }, [searchState]);

  
  useEffect(()=>{
    if(currentUser){
      //console.log(currentUser);
      socket.emit("initialData",currentUser);
    }
  },[currentUser])

  function sendmessage() {

    const time = new Date();
    console.log(`Current user is`,currentUser);

    socket.emit("send-message", {
        sendby:currentUser,
        sendto:friendActive,
        message,
        time,
    });

    setMessage(""); 
  }

  function handlefriendsclick(friend, index) {
    setActive(index);
    setFriendActive(friend);
    setMessageList([]);
  }

  const handleSearchChange = (e) => {
    setSearchState((_) => e.target.value);
  };

  return (
    <>
      <div className="outer">
        <div className="friends-list-outer">
          <div className="friends-list-upper">
            <div className="add-new-btn">Add New</div>
            <div className="friends-list-title">
              <h1>Chat</h1>
              <div className="search-bar">
                <input
                  type="text"
                  name="search"
                  defaultValue={searchState}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          {console.log("before component ",filterFriendList.length)}
          {
            filterFriendList.length!==0 ?
          (<RenderFriendList friendsList={filterFriendList} active={active} onlineFriends={onlineFriends} handlefriendsclick={handlefriendsclick} />):(<h1>Loading</h1>)}
          
        </div>
        <div className="chat-interface-outer">
          <h1>{friendActive?.name}</h1>
          <div className="chat-interface">
            <div className="chat-messages">
              {messageList.map((data, key) => (
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
                  setMessage(e.target.value);
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
