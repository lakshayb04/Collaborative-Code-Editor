import React, {useEffect, useRef, useState} from "react";
import Editor from "../components/Editor.js";
import {io} from "socket.io-client";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import "./Room.css"
import toast from "react-hot-toast";

const Room = () => {
  
  const navigate=useNavigate();
  const location=useLocation();
  const {roomId}=useParams();

  const [users,setUsers]=useState([]);

  const socketRef=useRef(null);
  const codeRef=useRef(null);

  const initSocket = async () => {
    const options = {
      "force new connection": true,
      reconnectionAttempt: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
    };
    return io(process.env.REACT_APP_BACKEND_URL,options);
  };

  const init=async()=>{
    socketRef.current=await initSocket();
    socketRef.current.on('connect_error',(err)=>{
      console.log("Error: ",err);
      toast.error("Something Went Wrong! Please Try Again");
      navigate("/"); 
    })

    socketRef.current.emit('join',{
      roomId,
      name:location.state?.name
    });

    socketRef.current.on('joined',({users,name,socketId})=>{
      if(name!=location.state?.name){
        toast.success(`${name} joined the room`);
        console.log(`${name} joined`);
      }
      setUsers(users);

      socketRef.current.emit('sync-code',{
        socketId,
        code:codeRef.current,
      });
    })

    socketRef.current.on('disconnected',({socketId,name})=>{
      toast.error(`${name} left the room`);
      setUsers(prevData=>[...prevData.filter(user=>user.socketId!=socketId)]);
    })


  };

  useEffect(()=>{
    init();
    return ()=>{
      socketRef.current.disconnect();
      socketRef.current.off('joined');
      socketRef.current.off('disconnected');
    }
  },[])

  if(!location.state){
    return <Navigate to="/"></Navigate>
  }


  const copyRoomId=async()=>{
    await navigator.clipboard.writeText(roomId);
    toast.success("Room ID Copied");
  }

  return (
    <div className="outer-container">
      <div className="side-container">
        <div className="side-title-container">
          <h1>Code Editor</h1>
        </div>
        <div className="side-info-container">
          <div className="side-info-title-container">
          <p>Connected Users</p>
          </div>
          <div className="side-users-container">
            {users.map((user,index)=>{
              return(
                <div>
                <p className="userName"><span className="index-span">{index+1}.</span> <span>{user.name}</span></p>
              </div>
              )
            })}
          </div>
        </div>
        <div className="side-buttons-container">
          <button type="click" className="copy-id-button" onClick={copyRoomId}>
            Copy Room ID
          </button>
          <button type="submit" className="leave-room-button" onClick={()=>{navigate("/")}}>
            Leave Room
          </button>
        </div>
      </div>
      <div className="editor-container">
        <Editor socketRef={socketRef} roomId={roomId} changeCode={(code)=>{codeRef.current=code;}}/>
      </div>
    </div>
  );
};

export default Room
 