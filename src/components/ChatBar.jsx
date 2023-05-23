import React, { useState, useRef } from 'react';
import { addDoc, collection, Timestamp } from "firebase/firestore";
import {db} from '../firebase.config'
import { useAuth } from '../AuthContext';
import { storage } from "../firebase.config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export default function ChatBar() {
    const {currentUser} = useAuth();
    const [message, setMessage] = useState({message: "", createdAt: Timestamp, uid: ""});
    const [ismessage, setismessage] = useState();
    const messageKeeperref = collection(db, "Messages");
    const textareaRef = useRef(null);
  const buttonRef = useRef(null);
  const [progresspercent, setProgresspercent] = useState(0);


    const msgSender = (e) => {
        e.preventDefault();
        
        if(message.message.trim().length > 0)
        {addDoc(messageKeeperref, message);
          setMessage({ message: '' });
          if (textareaRef.current) {
            textareaRef.current.value = '';
          }
        }
    }
    const msgSenderEnter = (e) => {
        if(e.keyCode == 13 && e.shiftKey == false) {
          e.preventDefault();
          
          if(message.message.trim().length > 0){
            addDoc(messageKeeperref, message);
            setMessage({ message: '' });
            e.target.value = '';

          }
          
        }
      }

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
              uid: currentUser.uid,
              createdAt: Timestamp.fromDate(new Date()),
            };
            addDoc(messageKeeperref, message);
            e.target.reset()
          }
        );
      };

      const imagechangeHandler = () => {
        buttonRef.current.click();
        
      };




    const changeHandler = (e) => {
        setMessage({message:e.target.value, createdAt: Timestamp.fromDate(new Date()), uid: currentUser.uid, pfp:currentUser.photoURL});
        if(e.target.value.trim().length > 0){
          setismessage(true)
        }else{
          setismessage(false)
        }
      }
  return (
    <div className=' bg-[#1E1E1E] py-3'>
    <div className=" mx-auto ml-28 md:ml-0 flex justify-end gap-10  pr-3" >
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
      <textarea ref={textareaRef} placeholder='Type a message' onChange={changeHandler} onKeyDown={msgSenderEnter} className='border-t-4 border-l-4 border-r-4 border-[#CCCCCC] outline-none md:w-[80%] md:rounded-full md:px-6 h-20 pt-6 px-4 rounded-md resize-none' style={{width: 'calc(100% - 10rem)'}}></textarea>
      <button className='text-white cursor-pointer' style={{pointerEvents:ismessage?'all':'none', opacity:ismessage?'1':'0.5'}} onClick={msgSender}><i className="fa-solid text-3xl fa-paper-plane"></i></button>
    </div>
    </div>
  )
}
