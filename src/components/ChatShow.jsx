import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase.config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { useAuth } from "../AuthContext";
import { useLongPress } from 'use-long-press';


export default function ChatShow(props) {
  const [chatcollection, setChatcollection] = useState([]);
  const [fchatcollection, setFChatcollection] = useState([]);
  const [usercollection, setUsercollection] = useState([]);
  const messagesEndRef = useRef(null);
  let combinedcollection = [];
  const { currentUser } = useAuth();
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    console.log(props.fid);

    const messageKeeperref = collection(db, "Rooms");
    const userKeeperref = collection(db, "Users");
    const q = query(
      messageKeeperref,
      where("uid", "==", currentUser.uid),
      where("fid", "==", props.fid),
      orderBy("createdAt")
    );
    const w = query(
      messageKeeperref,
      where("uid", "==", props.fid),
      where("fid", "==", currentUser.uid),
      orderBy("createdAt")
    );
    const userpfp = query(userKeeperref, where("uid", "==", currentUser.uid));

    const unsub = onSnapshot(q, (snapshot) => {
      setChatcollection(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        })
      );
    });

    const unsub2 = onSnapshot(w, (snapshot) => {
      setFChatcollection(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        })
      );
    });

    const unsub3 = onSnapshot(userpfp, (snapshot) => {
      setUsercollection(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        })
      );
    });

    return () => {
      unsub();
      unsub2();
      unsub3();
    };
  }, [props.fid, currentUser ]);
  

  combinedcollection = chatcollection
    .concat(fchatcollection)
    .sort(({ createdAt: a }, { createdAt: b }) => b - a)
    .reverse();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatcollection]);

  const deleteHandler = (id) => {
    deleteDoc(doc(db, "Rooms", id));
  };

  const deleteHolder = useLongPress((id, e) => {
    deleteDoc(doc(db, "Rooms", e.context));
  });

  const isValidUrl = (urlString) => {
    var urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  };

  

  return (
    <div className="bg-[#1E1E1E]">
      <div className="mx-auto ml-32 md:ml-3  h-[70vh] justify-end flex flex-col">
        <div className="text-white w-full overflow-y-auto father pr-4">
          {combinedcollection.map((messages, i) =>
            messages.uid === currentUser.uid ? (
              <div
                key={i}
                style={{ justifyContent: "right", alignItems: "center" }}
                className="messages flex w-full"
              >
                {" "}
                {!isValidUrl(messages.message) ? (
                  <span
                    style={{  overflowWrap: "break-word" }}
                   className= 'message mb-3 w-[40%] mr-[5rem] md:mr-[4rem]  flex justify-end align-baseline md:gap-0 gap-3'
                  >
                  <span className="messagechild md:hidden">
                  <button onClick={() => deleteHandler(messages.id)}>
                  <i class="fa-solid fa-trash"></i>
                </button>
                  </span>
                  <span {...deleteHolder(messages.id)} className="text-center bg-[#0D99FF] w-[100%] px-9 py-2  rounded-[3px]">
                    {messages.message}
                    </span>
                  </span>
                ) : (
                  <span
                    style={{  overflowWrap: "break-word" }}
                    className=" mb-3 w-[40%] mr-[5rem] md:mr-[4rem] message flex md:gap-0 gap-3"
                  >
                  <span className="messagechild md:hidden">
                  <button onClick={() => deleteHandler(messages.id)}>
                  <i class="fa-solid fa-trash"></i>
                </button>
                  </span>
                    <span>
                    <img
                      className="rounded-[3px]"
                      src={messages.message}
                      alt=""
                      {...deleteHolder(messages.id)}
                    />
                    </span>
                  </span>
                )}
                {i >= 1 &&
                  i < combinedcollection.length - 1 &&
                  combinedcollection[i + 1].uid != messages.uid && (
                    <img
                      className="w-10 h-10 -ml-[2.6rem]  rounded-full"
                      
                      src={usercollection[0].pfp}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  )}
                {i === combinedcollection.length - 1 && (
                  <img
                    className="w-10 h-10 -ml-[2.6rem]  rounded-full"
                    
                    src={usercollection[0].pfp}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                )}
                {i === 0 &&
                  combinedcollection.length > 1 &&
                  combinedcollection[i + 1].uid != messages.uid && (
                    <img
                      className="w-10 h-10 -ml-[2.6rem]  rounded-full"
                      
                      src={usercollection[0].pfp}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  )}
                {/* <button onClick={() => deleteHandler(messages.id)}>
                  DELETE
                </button> */}
              </div>
            ) : (
              <div
                key={i}
                style={{ justifyContent: "left", alignItems: "center" }}
                className="messages flex"
              >
                {i >= 1 &&
                  i < combinedcollection.length - 1 &&
                  combinedcollection[i + 1].uid != messages.uid && (
                    <img
                      
                      className="w-10 h-10 -mr-[2.5rem] rounded-full"
                      src={props.pfp}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  )}
                {i === combinedcollection.length - 1 && (
                  <img
                    
                    className="w-10 h-10 -mr-[2.5rem] rounded-full"
                    src={props.pfp}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                )}
                {i === 0 &&
                  combinedcollection.length > 1 &&
                  combinedcollection[i + 1].uid != messages.uid && (
                    <img
                      
                      className="w-10 h-10 -mr-[2.5rem] rounded-full"
                      src={props.pfp}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  )}
                {!isValidUrl(messages.message) ? (
                  <span
                    className="text-center ml-[5rem] md:ml-[4rem] bg-[#757575] px-9 py-2 mb-3 w-[40%]  rounded-[3px]"
                    style={{  overflowWrap: "break-word" }}
                  >
                    {messages.message}
                  </span>
                ) : (
                  <span
                    style={{  overflowWrap: "break-word" }}
                    className="text-center ml-[5rem] md:ml-[4rem] mb-3 w-[40%]  "
                  >
                    <img className="rounded-[3px]" src={messages.message} alt="" />
                  </span>
                )}
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
