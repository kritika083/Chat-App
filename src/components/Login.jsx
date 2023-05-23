import React, { useRef } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const vidRef = useRef(null);
  const textRef = useRef(null);
  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      await signInWithGoogle();
      alert("Logged In");
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  const videohandler = (e) => {
    e.preventDefault;
    vidRef.current.play();
    vidRef.current.style.display = "block";
    textRef.current.style.display = "none";
  };

  return (
    <div className="text-white  overflow-hidden h-[100vh] bg-[#000000] login">
      <header className="grid grid-flow-col justify-center">
        <div className="w-32 h-32 md:w-16 md:h-20 sm:w-17 sm:h-17  ">
          <img src="https://www.figma.com/component/eecdcc4486aed6169c9b49765c1227966adf2e19/thumbnail?ver=457%3A35&fuid=1156241469122210858" className="w-full h-full"/>
        </div>
        <h1 className="heading text-8xl md:text-7xl sm:text-5xl  pt-3 "> HomieSquad</h1>
      </header>
      <main>
        <div className="warn cust:-rotate-90 xl:text-lg md:-left-32 xl:top-72 custsm:-left-52 custsm:top-[27rem] custsm:w-[28rem]   absolute top-60 left-6 -rotate-[21.7deg] w-96">
          Chats are not end to end encrypted &#128532;.
        </div>
        <div className="warn cust:rotate-90 xl:text-lg md:-right-36 custsm:top-[27rem] custsm:-right-40   absolute top-80 right-6 rotate-[21.7deg] w-[25rem]">
          Don’t spread terrorist activities here &#128591;.
        </div>

        <div className="video" onClick={videohandler}>
          <div ref={textRef} className="vidtext">
            Tap To Understand Rules if you are Indian enough.
          </div>
          <video ref={vidRef} src="Rules_No.6.mp4" controls></video>
        </div>
        <div className="loginbut">
          <button className="real" onClick={loginHandler}>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 256 262"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              />
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              />
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              />
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              />
            </svg>{" "}
            <span>Come In</span>{" "}
          </button>
        </div>
      </main>
    </div>
  );
}
