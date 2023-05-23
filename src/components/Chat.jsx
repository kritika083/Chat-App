import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase.config";
import {
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { useLongPress } from 'use-long-press';

export default function Chat() {
  const [chatcollection, setChatcollection] = useState([]);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const messageKeeperref = collection(db, "Messages");
    const q = query(messageKeeperref, orderBy("createdAt"));
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

    return () => {
      unsub();
    };
  }, [currentUser]);

  const deleteHandler = (id) => {
    deleteDoc(doc(db, "Messages", id));
  };

  const deleteHolder = useLongPress((id, e) => {
    deleteDoc(doc(db, "Messages", e.context));


  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatcollection]);

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
    <div className="mx-auto ml-32 md:ml-3 h-[70vh] justify-end flex flex-col">
      <div className="text-white w-full overflow-y-auto father pr-4">
        {chatcollection.map((messages, i) =>
          messages.uid === currentUser.uid ? (
            <div
              key={i}
              style={{ justifyContent: "right", alignItems: "center" }}
              className="messages flex w-full"
            >
              {i >= 1 &&
                i < chatcollection.length - 1 &&
                chatcollection[i + 1].uid != messages.uid &&
                (!isValidUrl(messages.message) ? (
                  <span
                    style={{
                      marginRight: "2.5rem",
                      overflowWrap: "break-word",
                    }}
                    className="message flex justify-end mb-3 w-[40%] gap-3"
                  >
                    <span className="messagechild md:hidden">
                      <button onClick={() => deleteHandler(messages.id)}>
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </span>
                    <span {...deleteHolder(messages.id)} className="w-full text-center bg-[#0D99FF] px-9 py-2  rounded-[3px]">
                      {messages.message}
                    </span>
                  </span>
                ) : (
                  
                  <span
                   style={{
                      marginRight: "2.5rem",
                      overflowWrap: "break-word",
                    }}
                    className="message flex justify-end mb-3 w-[40%] gap-3">
                     <span className="messagechild md:hidden">
                      <button onClick={() => deleteHandler(messages.id)}>
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </span>
                    <span>
                    <img src={messages.message} alt="" />
                  </span></span>
                ))}
              {i >= 1 &&
                i < chatcollection.length - 1 &&
                chatcollection[i + 1].uid === messages.uid &&
                (!isValidUrl(messages.message) ? (
                  <span
                    style={{ marginRight: "5rem", overflowWrap: "break-word" }}
                    className="message flex justify-end mb-3 w-[40%] gap-3"
                  >
                    <span className="messagechild md:hidden">
                      <button onClick={() => deleteHandler(messages.id)}>
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </span>
                    <span {...deleteHolder(messages.id)} className="w-full text-center bg-[#0D99FF] px-9 py-2  rounded-[3px]">
                      {messages.message}
                    </span>
                  </span>
                ) : (
                  <span style={{ marginRight: "5rem", overflowWrap: "break-word" }}
                    className="message flex justify-end mb-3 w-[40%] gap-3">
                     <span className="messagechild md:hidden">
                      <button onClick={() => deleteHandler(messages.id)}>
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </span>
                    <span>
                    <img src={messages.message} alt="" />
                  </span></span>
                ))}
              {i === chatcollection.length - 1 &&
                chatcollection[i].uid === messages.uid &&
                (!isValidUrl(messages.message) ? (
                  <span
                    style={{
                      marginRight: "2.5rem",
                      overflowWrap: "break-word",
                    }}
                    className="message flex justify-end mb-3 w-[40%] gap-3"
                  >
                    <span className="messagechild md:hidden">
                      <button onClick={() => deleteHandler(messages.id)}>
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </span>
                    <span {...deleteHolder(messages.id)} className="w-full text-center bg-[#0D99FF] px-9 py-2  rounded-[3px]">
                      {messages.message}
                    </span>
                  </span>
                ) : (
                  <span  style={{
                      marginRight: "2.5rem",
                      overflowWrap: "break-word",
                    }}
                    className="message flex justify-end mb-3 w-[40%] gap-3">
                     <span className="messagechild md:hidden">
                      <button onClick={() => deleteHandler(messages.id)}>
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </span>
                    <span>
                    <img src={messages.message} alt="" />
                  </span></span>
                ))}
              {i === 0 &&
                chatcollection.length > 1 &&
                1 &&
                chatcollection[i + 1].uid != messages.uid &&
                (!isValidUrl(messages.message) ? (
                  <span
                    style={{
                      marginRight: "2.5rem",
                      overflowWrap: "break-word",
                    }}
                    className="message flex justify-end mb-3 w-[40%] gap-3"
                  >
                    <span className="messagechild md:hidden">
                      <button onClick={() => deleteHandler(messages.id)}>
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </span>
                    <span {...deleteHolder(messages.id)} className="w-full text-center bg-[#0D99FF] px-9 py-2  rounded-[3px]">
                      {messages.message}
                    </span>
                  </span>
                ) : (
                  <span  style={{
                      marginRight: "2.5rem",
                      overflowWrap: "break-word",
                    }}
                    className="message flex justify-end mb-3 w-[40%] gap-3">
                     <span className="messagechild md:hidden">
                      <button onClick={() => deleteHandler(messages.id)}>
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </span>
                    <span>
                    <img src={messages.message} alt="" />
                  </span></span>
                ))}
              {i === 0 &&
                chatcollection.length > 1 &&
                1 &&
                chatcollection[i + 1].uid === messages.uid &&
                (!isValidUrl(messages.message) ? (
                  <span
                    style={{ marginRight: "5rem", overflowWrap: "break-word" }}
                    className="message flex justify-end mb-3 w-[40%] gap-3"
                  >
                    <span className="messagechild md:hidden">
                      <button onClick={() => deleteHandler(messages.id)}>
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </span>
                    <span {...deleteHolder(messages.id)} className="w-full text-center bg-[#0D99FF] px-9 py-2  rounded-[3px]">
                      {messages.message}
                    </span>
                  </span>
                ) : (
                  <span style={{ marginRight: "5rem", overflowWrap: "break-word" }}
                    className="message flex justify-end mb-3 w-[40%] gap-3">
                     <span className="messagechild md:hidden">
                      <button onClick={() => deleteHandler(messages.id)}>
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </span>
                    <span>
                    <img src={messages.message} alt="" />
                  </span></span>
                ))}
              {i >= 1 &&
                i < chatcollection.length - 1 &&
                chatcollection[i + 1].uid != messages.uid && (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={messages.pfp}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                )}
              {i === chatcollection.length - 1 && (
                
                <img
                  className="w-10 h-10 rounded-full"
                  src={messages.pfp}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              )}
              {i === 0 &&
                chatcollection.length > 1 &&
                chatcollection[i + 1].uid != messages.uid && (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={messages.pfp}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                )}
            </div>
          ) : (
            <div
              key={i}
              style={{ justifyContent: "left", alignItems: "center" }}
              className="messages flex"
            >
              {i >= 1 &&
                i < chatcollection.length - 1 &&
                chatcollection[i + 1].uid != messages.uid && (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={messages.pfp}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                )}
              {i === chatcollection.length - 1 && (
                <img
                  className="w-10 h-10 rounded-full"
                  src={messages.pfp}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              )}
              {i === 0 &&
                chatcollection.length > 1 &&
                chatcollection[i + 1].uid != messages.uid && (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={messages.pfp}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                )}
              {i >= 1 &&
                i < chatcollection.length - 1 &&
                chatcollection[i + 1].uid != messages.uid &&
                (!isValidUrl(messages.message) ? (
                  <span
                    className="text-center bg-[#757575] px-9 py-2 mb-3 w-[40%] rounded-[3px]"
                    style={{ marginLeft: "2.5rem", overflowWrap: "break-word" }}
                  >
                    {messages.message}
                  </span>
                ) : (
                  <span  className="text-center bg-[#757575] px-9 py-2 mb-3 w-[40%] rounded-[3px]"
                    style={{ marginLeft: "2.5rem", overflowWrap: "break-word" }}>
                    <img src={messages.message} alt="" />
                  </span>
                ))}
              {i >= 1 &&
                i < chatcollection.length - 1 &&
                chatcollection[i + 1].uid === messages.uid &&
                (!isValidUrl(messages.message) ? (
                  <span
                    className="text-center bg-[#757575] px-9 py-2 mb-3 w-[40%] rounded-[3px]"
                    style={{ marginLeft: "5rem", overflowWrap: "break-word" }}
                  >
                    {messages.message}
                  </span>
                ) : (
                  <span className="text-center bg-[#757575] px-9 py-2 mb-3 w-[40%] rounded-[3px]"
                    style={{ marginLeft: "5rem", overflowWrap: "break-word" }}>
                    <img src={messages.message} alt="" />
                  </span>
                ))}
              {i === chatcollection.length - 1 &&
                chatcollection[i].uid === messages.uid &&
                (!isValidUrl(messages.message) ? (
                  <span
                    className="text-center bg-[#757575] px-9 py-2 mb-3 w-[40%] rounded-[3px]"
                    style={{ marginLeft: "2.5rem", overflowWrap: "break-word" }}
                  >
                    {messages.message}
                  </span>
                ) : (
                  <span className="text-center bg-[#757575] px-9 py-2 mb-3 w-[40%] rounded-[3px]"
                    style={{ marginLeft: "2.5rem", overflowWrap: "break-word" }}>
                    <img src={messages.message} alt="" />
                  </span>
                ))}
              {i === 0 &&
                chatcollection.length > 1 &&
                1 &&
                chatcollection[i + 1].uid != messages.uid &&
                (!isValidUrl(messages.message) ? (
                  <span
                    className="text-center bg-[#757575] px-9 py-2 mb-3 w-[40%] rounded-[3px]"
                    style={{ marginLeft: "2.5rem", overflowWrap: "break-word" }}
                  >
                    {messages.message}
                  </span>
                ) : (
                  <span className="text-center bg-[#757575] px-9 py-2 mb-3 w-[40%] rounded-[3px]"
                    style={{ marginLeft: "2.5rem", overflowWrap: "break-word" }}>
                    <img src={messages.message} alt="" />
                  </span>
                ))}
              {i === 0 &&
                chatcollection.length > 1 &&
                1 &&
                chatcollection[i + 1].uid === messages.uid &&
                (!isValidUrl(messages.message) ? (
                  <span
                    className="text-center bg-[#757575] px-9 py-2 mb-3 w-[40%] rounded-[3px]"
                    style={{ marginLeft: "5rem", overflowWrap: "break-word" }}
                  >
                    {messages.message}
                  </span>
                ) : (
                  <span  className="text-center bg-[#757575] px-9 py-2 mb-3 w-[40%] rounded-[3px]"
                    style={{ marginLeft: "5rem", overflowWrap: "break-word" }}>
                    <img src={messages.message} alt="" />
                  </span>
                ))}
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
