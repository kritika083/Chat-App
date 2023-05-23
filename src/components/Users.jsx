import React, {useEffect, useState} from 'react';
import { onSnapshot, collection, query} from "firebase/firestore";
import {db} from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext";



export default function Users() {
    const [usercollection, setUsercollection] = useState([]);
    const [reqUsers, setReqUsers] = useState("");
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const uMessageKeeperref = collection(db, "Users");
        const q = query(uMessageKeeperref);
        const unsub = onSnapshot(q, (snapshot) => {
            setUsercollection(
              snapshot.docs.map((doc) => {
                return {
                  ...doc.data(),
                };
              })
            );
        });
        
        return () => {
            unsub();
        }; 
    }, [])

    const navigator = (id, pfp ,e) =>{
      e.preventDefault();
      navigate('/chatbox', {state:{fid:id, pfp:pfp}})
    }

  return (
    <div className='users w-full h-[70vh] md:h-screen  bg-[#1E1E1E] text-white'>
    <h1 className='text-4xl md:py-5 mb-5 text-center '>Some Epic Users </h1>
    <div className='mx-auto w-[90%] '>
      <textarea  placeholder='Search Users...' className='w-full px-3 border-[6px] outline-none md:border-[3px] md:text-lg md:h-[4rem] md:leading-[4rem] md:rounded-full md:px-8 text-black text-xl resize-none h-[6rem] leading-[6rem] overflow-hidden rounded' onChange={event => setReqUsers(event.target.value)}></textarea>
      </div>
      {reqUsers.length===0 && usercollection.map((user) => (
        user.uid!=currentUser.uid && <div className='mx-auto w-[90%] my-10' key={user.uid}> <button onClick={e=>navigator( user.uid, user.pfp, e)}> <span className='flex align-middle gap-24' style={{alignItems:'center'}}> <img className='h-14 w-1h-14 rounded-full' src={user.pfp} referrerPolicy="no-referrer" /> {user.name}  <span className='hover:text-red-500'><i class="fa-solid fa-message text-2xl"></i></span> </span> </button></div>
      ))}
      {reqUsers.length > 0 && usercollection.filter(user => {
        if(user.name.toLowerCase().includes(reqUsers.toLowerCase())){
          return user
        }
      }).map((user)=>(
        user.uid!=currentUser.uid && <div className='mx-auto w-[90%] my-10' key={user.uid}> <button onClick={e=>navigator( user.uid, user.pfp, e)}> <span className='flex align-middle gap-24' style={{alignItems:'center'}}> <img className='h-14 w-1h-14 rounded-full' src={user.pfp} referrerPolicy="no-referrer" /> {user.name}  <span className='hover:text-red-500'><i class="fa-solid fa-message text-2xl"></i></span> </span> </button></div>
        
        ))
      }
    </div>
  )
}
