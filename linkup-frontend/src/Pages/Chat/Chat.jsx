import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import Cookies from "js-cookie";
import io from "socket.io-client";
import Message from "../../Components/Messages/Message";
import axios from 'axios';
import SimpleCrypto from 'simple-crypto-js';

const RenderFriendList = ({ friendsList, active, onlineFriends, handleFriendsClick }) => (
  <>
    {friendsList.map((friend, index) => (
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
    ))}
  </>
);

export default function Chat() {
  const [friendsList, setFriendsList] = useState([]);
  const [filterFriendList, setFilterFriendList] = useState([]);
  const [active, setActive] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState({});
  const [friendActive, setFriendActive] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchState, setSearchState] = useState("");

  const secretKey = process.env.REACT_APP_CRYPTO_SECRET;
  const crypto = new SimpleCrypto(secretKey);

  const currentUserRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://linkup-backend-k05n.onrender.com/user/getallusers"
        );
        setFriendsList(response.data);
        setFilterFriendList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getcookies = Cookies.get('linkupdata');
    const temp = crypto.decrypt(getcookies);
    setCurrentUser({ ...temp });

    currentUserRef.current = { ...temp };

    const socket = io.connect("http://localhost:3001");
    socketRef.current = socket;

    socket.on('connect', () => {
      const socketID = socket.id;
      setCurrentUser(prevUser => ({ ...prevUser, socketID }));
      socket.emit("initialData", { ...temp, socketID }); // Emit initialData after the connection is established
    });

    socket.on("online-people", (onlinePeople) => {
      setOnlineFriends(onlinePeople);
    });

    socket.on("recieve-message", (messageData) => {
      const currentUser = currentUserRef.current;

      const friendEmail =
        messageData.sendto.email === currentUser?.email
          ? messageData.sendby.email
          : messageData.sendto.email;

      if (friendEmail) {
        setMessageList((prev) => ({
          ...prev,
          [friendEmail]: [...(prev[friendEmail] || []), messageData],
        }));
      }
    });

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
    }    else {
      setFilterFriendList(friendsList);
    }
  }, [searchState, friendsList]);

  function sendmessage() {
    const time = new Date();

    socketRef.current.emit("send-message", {
      sendby: currentUserRef.current,
      sendto: friendActive,
      message,
      time,
    });

    setMessage("");
  }

  function handleFriendsClick(friend, index) {
    setActive(index);
    setFriendActive(friend);

    const friendMessages = messageList[friend.email] || [];
    setMessageList((prev) => ({
      ...prev,
      [friend.email]: friendMessages,
    }));
  }

  const handleSearchChange = (e) => {
    setSearchState(e.target.value);
  };

  function debugging() {
    console.log("Current User is", currentUserRef.current?.name);
    console.log(messageList);
  }

  return (
    <>
      <div className="outer">
        <div className="friends-list-outer">
          <div className="friends-list-upper">
            <div className="add-new-btn" onClick={debugging}>Add New</div>
            <div className="friends-list-title">
              <h1>Chat</h1>
              <div className="search-bar">
                <input
                  type="text"
                  name="search"
                  value={searchState}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          {filterFriendList.length !== 0 ? (
            <RenderFriendList
              friendsList={filterFriendList}
              active={active}
              onlineFriends={onlineFriends}
              handleFriendsClick={handleFriendsClick}
            />
          ) : (
            <h1>Loading</h1>
          )}
        </div>
        <div className="chat-interface-outer">
          <h1>{friendActive?.name}</h1>
          <div className="chat-interface">
            <div className="chat-messages">
              {friendActive &&
                messageList[friendActive.email]?.map((messageData, key) => (
                  <Message
                    currentUser={currentUserRef.current?.name}
                    sendby={messageData.sendby}
                    time={messageData.time}
                    message={messageData.message}
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
