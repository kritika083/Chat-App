import React from 'react';
import { useAuth } from '../AuthContext';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export default function NavBar() {
    const navigate= useNavigate();
    const {currentUser} = useAuth();

    const redirector = () => {
      if(window.innerWidth <= 767){
      navigate('/users')}
    }

  return (
    <nav className='flex justify-between align-middle md:ml-3  bg-[#1E1E1E] md:w-[90%] w-[53%] ml-32 py-7'>
        <div className='w-[4rem] h-[4rem] '>
        <Link to='/home'><img src="https://www.figma.com/component/eecdcc4486aed6169c9b49765c1227966adf2e19/thumbnail?ver=457%3A35&fuid=1156241469122210858" className="h-full w-full"/></Link>  
        </div>
        <div className='w-[3rem] h-[3rem] ' onClick={redirector}>
            {currentUser && <img src={currentUser.photoURL} referrerPolicy='no-referrer' className="h-full w-full rounded-full hover:cursor-pointer"/>}
        </div>
    </nav>
  )
}
