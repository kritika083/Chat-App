import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useAuth } from "../AuthContext";
import ChatShow from "./ChatShow";
import { storage } from "../firebase.config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import NavBar from "./NavBar";
import Users from "./Users";
import { useNavigate } from "react-router-dom";


export default function ChatBox() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const textareaRef = useRef(null);
  const buttonRef = useRef(null);
  const [message, setMessage] = useState({
    message: "",
    fid: "",
    uid: "",
    createdAt: Timestamp,
    pfp: location.state.pfp,
  });
  const messageKeeperref = collection(db, "Rooms");
  const [progresspercent, setProgresspercent] = useState(0);
  const [ismessage, setismessage] = useState(false);

  const msgSender = (e) => {
    e.preventDefault();
    if (message.message.trim().length > 0) {
      addDoc(messageKeeperref, message);
      setMessage({ message: "" });
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    }
  };
  const msgSenderEnter = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      {
        if (message.message.trim().length > 0)
          addDoc(messageKeeperref, message);
        setMessage({ message: "" });
        e.target.value = "";
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];
    if (!file) {
      return;
    }
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
        console.log(progresspercent);
      },
      (error) => {
        alert(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const message = {
          message: downloadURL,
          fid: location.state.fid,
          uid: currentUser.uid,
          createdAt: Timestamp.fromDate(new Date()),
          pfp: location.state.pfp,
        };
        addDoc(messageKeeperref, message);
        e.target.reset()
        console.log(isimage)
      }
    );
  };

  const changeHandler = (e) => {
    setMessage({
      message: e.target.value,
      fid: location.state.fid,
      uid: currentUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
      pfp: location.state.pfp,
    });
    if (e.target.value.length > 0) {
      setismessage(true);
    } else {
      setismessage(false);
    }
  };

  const imagechangeHandler = () => {
    buttonRef.current.click();
    
  };

  const logoutHandler = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };

  return (
    <div className="bg-[#1E1E1E]  h-full">
      <NavBar />
      <div className="holder  flex">
      <div className="w-[65%] md:w-full  bg-[#1E1E1E]">
        <ChatShow fid={location.state.fid} pfp={location.state.pfp} />
        <div className="ml-28 md:ml-3  w-[85%] my-3 flex justify-center  align-middle md:gap-2 gap-10  ">
        <form  onSubmit={handleSubmit} className="form   py-4   align-middle flex-row-reverse">
            <label
              className="bg-red-900 label"
              style={{
                display: " inline-block",
                }}
            >
              <input
                type="file"
                style={{ display: "none" }}
                onChange={imagechangeHandler}
                accept="image/x-png,image/gif,image/jpeg"
              />
            </label>
            <button className="hidden" ref={buttonRef} type="submit">Upload</button>
          </form>
          <textarea
            ref={textareaRef}
            onChange={changeHandler}
            onKeyDown={msgSenderEnter}
            placeholder='Type a message'
            className="border-4 border-b-0 md:rounded-full md:px-6 border-[#CCCCCC] outline-none w-full h-20 pt-6 rounded-md resize-none"
          ></textarea>
          <button
            className="text-white b-2 z-10 "
            style={{
              pointerEvents: ismessage ? "all" : "none",
              opacity: ismessage ? "1" : "0.5",
            }}
            onClick={msgSender}
          >
            <i className="fa-solid text-3xl cursor-pointer fa-paper-plane md:-mr-10 ml-3"></i>
          </button>
          
        </div>
      </div>
      <div className="w-[0.7%] ml-3 -mt-24 h-[100vh] md:hidden bg-white z-10"> </div>
      <div className="bg-[#1E1E1E] w-[35%] usersec md:hidden text-white">
      <Users/>
      </div>
      </div>
      <button className="fixed bottom-3 left-5 md:bottom-0 md:left-0" onClick={logoutHandler}><i class="text-white hover:text-red-700 text-3xl fa-solid fa-arrow-right-from-bracket"></i></button>
    </div>
  );
}
