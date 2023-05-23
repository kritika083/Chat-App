import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import ChatBar from "./ChatBar";
import Chat from "./Chat";
import Users from "./Users";
import NavBar from "./NavBar";

export default function Home() {
  const { logout } = useAuth();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!currentUser){
      return
    }
    setDoc(
      doc(db, "Users", currentUser.uid),
      { name: currentUser.displayName, uid: currentUser.uid, pfp:currentUser.photoURL },
      { merge: true }
    );

  }, [db, currentUser])

  const logoutHandler = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };
  return (
    <div className="bg-[#1E1E1E]">
    <NavBar/>
    <div className="holder bg-[#1E1E1E]">
      <div className="chatsec md:w-full  w-[65%]">
      <Chat/>
      <ChatBar />
      </div>
      <div className="w-[0.7%] ml-3 md:hidden -mt-24 h-[100vh] bg-white z-10"> </div>
      <div className="usersec md:hidden text-white w-[35%]  bg-[#1E1E1E]">
      <Users/>
      </div>
    </div>
      <button className="fixed bottom-3 left-5 md:bottom-0 md:left-2" onClick={logoutHandler}><i className="text-white hover:text-red-700 text-3xl fa-solid fa-arrow-right-from-bracket"></i></button>
    </div>
  );
}
