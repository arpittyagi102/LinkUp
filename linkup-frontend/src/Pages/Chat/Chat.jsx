import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import Cookies from "js-cookie";
import io from "socket.io-client";
import Message from "../../Components/Messages/Message";
import SimpleCrypto from 'simple-crypto-js';
import FriendsList from "../../Components/FriendsList/Friends";
import emojiicon from "../../Assets/icons/emoji.svg";
import imageicon from "../../Assets/icons/image.svg";
import sendicon from "../../Assets/icons/send.svg";
import usericon from "../../Assets/icons/user.svg";
import callicon from "../../Assets/icons/call.svg";
import videocallicon from "../../Assets/icons/videocall.svg";
import menuicon from "../../Assets/icons/menu.svg";
import { motion, AnimatePresence } from 'framer-motion';
import Picker from "emoji-picker-react";

export default function Chat() {
  const [active, setActive] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState({});
  const [friendActive, setFriendActive] = useState(FriendsList[0]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const secretKey = process.env.REACT_APP_CRYPTO_SECRET;
  const crypto = new SimpleCrypto(secretKey);

  const currentUserRef = useRef(null);
  const socketRef = useRef(null);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const getcookies = Cookies.get('linkupdata');
    const temp = crypto.decrypt(getcookies);
    setCurrentUser({ ...temp });

    currentUserRef.current = { ...temp };

    const socket = io.connect("https://linkup-backend-k05n.onrender.com");
    socketRef.current = socket;

    socket.on('connect', () => {
      const socketID = socket.id;
      setCurrentUser(prevUser => ({ ...prevUser, socketID }));
      socket.emit("initialData", { ...temp, socketID });
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


  function sendmessage() {
    const time = new Date();

     socketRef.current.emit("send-message", {
      sendby: currentUserRef.current,
      sendto: friendActive,
      message,
      time,
    });

    setMessage("");
    setShowEmojiPicker(false);

  }


  function handleFriendsClick(friend, index) {
    setActive(index);
    setFriendActive(friend);
    setShowEmojiPicker(false)

    const friendMessages = messageList[friend.email] || [];
    setMessageList((prev) => ({
      ...prev,
      [friend.email]: friendMessages,
    }));
  }

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiData, event) => {
      const emoji = emojiData.emoji
      const msg = message + emoji;
      setMessage(msg);
  };

  return (
    <>
      <div className="outer">
        <FriendsList active={active} friendActive={friendActive} setFriendActive={setFriendActive} onlineFriends={onlineFriends} handleFriendsClick={handleFriendsClick} />
        <div className="chat-interface-outer">
          <div className="friend-active-details">
          <img src={friendActive?.picture ? friendActive.picture : usericon} className="friend-active-picture" alt="user icon"/>
          {console.log(friendActive?.picture)}
          <div className="friend-active-nl">
            <div className="friend-active-name">{friendActive?.name}</div>
            <div className="friend-active-last-seen">3 Days ago</div>
          </div>
          <div className="friend-active-details-icon-cover" style={{marginLeft:"auto"}}>
            <img src={callicon} className="friend-active-details-icon" alt="friend-active-details-icon"/>
          </div>
          <div className="friend-active-details-icon-cover">
            <img src={videocallicon} className="friend-active-details-icon" alt="friend-active-details-icon"/>
          </div>
          <div className="friend-active-details-icon-cover">
            <img src={menuicon} className="friend-active-details-icon" height="25px" alt="friend-active-details-icon"/>
          </div>
          </div>
          <div className="chat-interface">
            <div className="chat-messages" ref={chatMessagesRef}>
            <AnimatePresence>
              {friendActive &&
                messageList[friendActive.email]?.map((messageData, key) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, translateY: 50}}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{display:"flex",flexDirection:"column",alignContent:"flex-end"}}
                  >
                    <Message
                      currentUser={currentUserRef.current?.name}
                      sendby={messageData.sendby}
                      time={messageData.time}
                      message={messageData.message}
                      key={key}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>

            </div>
            <div className="message-input-outer">
              <input
                type="text"
                className="message-input"
                value={message}
                placeholder="Type your message..."
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendmessage();
                  }
                }}
              />
              <img src={emojiicon} className="message-input-icons" alt="icons"  onClick={handleEmojiPickerhideShow}/>
              {showEmojiPicker && (
                <div className="picker-container">
                  <Picker onEmojiClick={handleEmojiClick} theme="dark"/>
                </div>
              )}
              <img src={imageicon} className="message-input-icons" alt="icons"/>
              <img src={sendicon} className="message-input-icons" alt="icons"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
