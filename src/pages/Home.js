import React, { useState } from "react";
import "./Home.css";
import { v4 as uuidv4 } from "uuid";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const navigate=useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("New Room ID Created");
  };

  const joinRoom=(e)=>{
    e.preventDefault();
    if(!roomId || !name){
        toast.error("Room ID and Name is required");
        return;
    }
    navigate(`/room/${roomId}`,{
      state:{
        name
      }
    });
  }

  const handleEnter=(e)=>{
    if(e.key==='Enter'){
        joinRoom(e); 
    }
  }

  return (
    <div className="home-outer-container">
      <div className="home-title-container">
        <h1 className="home-title">Real-Time Code Editor</h1>
      </div>
      <div className="home-form-container">
        <h3 className="home-form-title">Enter Room Id and Name</h3>
        <div className="home-input-container">
          <input
            type="text"
            placeholder="Enter Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleEnter}
          ></input>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyUp={handleEnter}
          ></input>
          <button type="submit" className="home-submit-button" onClick={(e)=>joinRoom(e)}>
            Join Room
          </button>
          <h5 className="home-create-room">
            <a href="" onClick={createNewRoom}>
              Create New Room
            </a>
          </h5>
        </div>
      </div>
      <div className="home-footer">
        <p>Copyright © {new Date().getFullYear()}</p>
        <p>Made By Lakshay Bindlish</p>
      </div>
    </div>
  );
};

export default Home;
