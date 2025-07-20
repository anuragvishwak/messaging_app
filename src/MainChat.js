import React, { useEffect, useState } from "react";
import ChatSideNavbar from "./ChatSideNavbar";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { database } from "./FirebaseConfig";
import { FaUser } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { BiMessage } from "react-icons/bi";

function MainChat() {
  const email = JSON.parse(localStorage.getItem("user"))?.trim();
  const receiver = localStorage.getItem("receiver");

  const [gettingUsers, setgettingUsers] = useState([]);
  const [collectingMessages, setcollectingMessages] = useState("");
  const [renderMessages, setrenderMessages] = useState([]);
  const [migratingUser, setmigratingUser] = useState([]);
  const [selectedUser, setselectedUser] = useState("");

  console.log("finding selected user", selectedUser);

  async function creatingMessages() {
    try {
      await addDoc(collection(database, "message_database"), {
        message: collectingMessages,
        email: email,
        receiver: receiver,
        time: serverTimestamp(),
      });
      renderingUser();
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }

  async function renderingMessages() {
    const taskDetails = await getDocs(collection(database, "message_database"));
    let multipleArray = taskDetails.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const filteredArray = multipleArray.filter((task) => task.email === email);
    const reversedArray = filteredArray.reverse();
    setrenderMessages(multipleArray);
    renderingUser();
  }

  async function renderingUser() {
    const taskDetails = await getDocs(collection(database, "user_database"));
    let multipleArray = taskDetails.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredArray = multipleArray.filter((task) => task.email === email);
    setgettingUsers(multipleArray);
    setmigratingUser(multipleArray);
  }

  useEffect(() => {
    renderingUser();
    renderingMessages();
  }, []);

  return (
    <div className="flex">
      <ChatSideNavbar
        setselectedUser={setselectedUser}
        migratingUser={migratingUser}
      />
      {selectedUser ? (
        <div className="flex flex-col w-full h-screen">
          <div className="">
            {gettingUsers
              .filter((user) => user.email === selectedUser)
              .map((user) => (
                <div className="flex items-center space-x-2 p-4 border-b w-full border-gray-300">
                  <FaUser
                    size={35}
                    className="bg-blue-500 rounded-full p-1.5 text-white"
                  />
                  <div>
                    <p className="text-xl font-bold">{user.user_name}</p>
                    <p className="text-sm">{user.email}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex-1 bg-gray-100 overflow-y-auto p-4 space-y-4">
            {renderMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.email === email ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                    message.email === email
                      ? "bg-blue-500 text-white"
                      : "bg-white  text-black"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <div className="flex justify-end">
                    <p className="text-sm font-gray-400"> {message.timestamp?.toDate().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex border-t shadow items-center space-x-2 p-4">
            <input
              onChange={(e) => setcollectingMessages(e.target.value)}
              placeholder="Write a message..."
              className="w-full border  border-gray-400 rounded-full p-2"
            ></input>
            <button
              onClick={() => {
                creatingMessages();
              }}
              className="text-white bg-blue-500 p-2 rounded-full"
            >
              <IoSendSharp size={25} />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center w-full justify-center">
          <div>
            <div className="flex justify-center">
              <BiMessage
                className="text-gray-400 flex justify-center"
                size={100}
              />
            </div>
            <p className="text-center text-3xl font-bold my-4 text-gray-400">
              Select an chat to continue chatting
            </p>
            <p className="text-gray-400 w-[560px] text-justify">
              We believe in giving you full control over your messaging
              experience. Your login credentials, contact list, and message
              history are protected with industry best practices. You can focus
              on conversations while we handle the rest — securely.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainChat;
