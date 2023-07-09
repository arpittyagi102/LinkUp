import React, { useState,useEffect } from "react";
import axios from "axios";
import searchicon from "../../Assets/icons/search.svg"
import "./Friends.css";

export default function FriendList({ active, friendActive, onlineFriends, handleFriendsClick }){

    const [searchState, setSearchState] = useState("");
    const [friendsList, setFriendsList] = useState([]);
    const [filterFriendList, setFilterFriendList] = useState([]);
    const [searchInputActive, setSearchInputActive] = useState(false);

    const handleSearchChange = (e) => {
        setSearchState(e.target.value);
      };

    const handleFocus = () => {
      setSearchInputActive(true);
    };
  
    const handleBlur = () => {
      setSearchInputActive(false);
    };

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

    

    return (
    <>
        <div className="left-half-outer">
          <div className="friends-list-upper">
            <div className="add-new-btn">Add New</div>
            <div className="friends-list-title">
              <h1>Chat</h1>
              <div className={`search-bar ${searchInputActive && "search-input-active"}`}>
                <input
                  type="text"
                  name="search"
                  value={searchState}
                  onChange={handleSearchChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <img src={searchicon} alt="search" style={{height:"25px"}}/>
              </div>
            </div>
          </div>
        <div className="friends-list-outer">
          {filterFriendList?.length !== 0 ? (
            filterFriendList.map((friend, index) => (
                <div
                  className={`friends-outer ${friend.email === friendActive?.email ? "active" : ""}`}
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
              ))
          ) : (
            <h1>Loading</h1>
          )}
        </div>
        </div>
    </>
)}