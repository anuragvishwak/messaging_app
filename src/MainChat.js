import React, { useEffect, useState } from "react";
import ChatSideNavbar from "./ChatSideNavbar";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { database } from "./FirebaseConfig";
import { FaUser, FaUsers } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { BiMessage } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

function MainChat() {
  const email = JSON.parse(localStorage.getItem("user"))?.trim();
  const receiver = localStorage.getItem("receiver");
  const selectedGroupId = localStorage.getItem("selectedGroup");
  const currentChannelFromStorage = localStorage.getItem("currentChatChannel");
  const [gettingUsers, setgettingUsers] = useState([]);
  const [collectingMessages, setcollectingMessages] = useState("");
  const [renderMessages, setrenderMessages] = useState([]);
  const [migratingUser, setmigratingUser] = useState([]);
  const [renderingGroupDetails, setrenderingGroupDetails] = useState([]);
  const [selectedUser, setselectedUser] = useState(receiver || "");
  const [selectedGroup, setselectedGroup] = useState(selectedGroupId || "");
  const [openingActionBlock, setopeningActionBlock] = useState(false);
  const [currentChatChannel, setcurrentChatChannel] = useState(
    currentChannelFromStorage || "single"
  );

  async function creatingMessages() {
    try {
      const collectionName =
        currentChatChannel === "group"
          ? "group_message_database"
          : "message_database";

      await addDoc(collection(database, collectionName), {
        message: collectingMessages,
        email: email,
        receiver: currentChatChannel === "group" ? selectedGroup : receiver,
        time: serverTimestamp(),
      });

      setcollectingMessages("");
      renderingMessages();
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  }

  async function renderingMessages() {
    const collectionName =
      currentChatChannel === "group"
        ? "group_message_database"
        : "message_database";

    const taskDetails = await getDocs(collection(database, collectionName));
    let allMessages = taskDetails.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredMessages =
      currentChatChannel === "group"
        ? allMessages.filter((msg) => msg.receiver === selectedGroup)
        : allMessages.filter(
            (msg) =>
              (msg.email === email && msg.receiver === receiver) ||
              (msg.email === receiver && msg.receiver === email)
          );

    const sortedMessages = filteredMessages.sort((a, b) => {
      const timeA = a.time?.toDate?.() || new Date(0);
      const timeB = b.time?.toDate?.() || new Date(0);
      return timeA - timeB;
    });

    setrenderMessages(sortedMessages);
  }

  async function renderingUser() {
    const userDocs = await getDocs(collection(database, "user_database"));
    const users = userDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const groupDocs = await getDocs(collection(database, "group_database"));
    const groups = groupDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setgettingUsers(users);
    setmigratingUser(users);
    setrenderingGroupDetails(groups);
  }

  useEffect(() => {
    renderingUser();
    renderingMessages();
  }, [currentChatChannel, selectedUser, selectedGroup, email, receiver]);

  return (
    <div className="flex">
      <ChatSideNavbar
        setselectedUser={setselectedUser}
        migratingUser={migratingUser}
        setselectedGroup={setselectedGroup}
        currentChatChannel={currentChatChannel}
        setcurrentChatChannel={setcurrentChatChannel}
      />

      {email ? (
        <div className="flex flex-col w-full h-screen">
          {/* Header */}
          <div>
            {currentChatChannel === "single" &&
              gettingUsers
                .filter(
                  (user) =>
                    user.email === selectedUser || user.email === receiver
                )
                .map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center justify-between p-2 border-b w-full border-gray-300"
                  >
                    <div className="flex items-center space-x-2">
                      <FaUser
                        size={35}
                        className="bg-blue-500 rounded-full p-1.5 text-white"
                      />
                      <div>
                        <p className="text-xl font-bold">{user.user_name}</p>
                        <p className="text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          setopeningActionBlock(!openingActionBlock)
                        }
                      >
                        <BsThreeDotsVertical size={20} />
                      </button>
                      {openingActionBlock && (
                        <div className="bg-white shadow-md flex flex-col rounded p-3 absolute border right-2 mt-2">
                          <button>Block User</button>
                          <button>Report User</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

            {currentChatChannel === "group" &&
              renderingGroupDetails
                .filter((group) => group.id === selectedGroup)
                .map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-2 border-b w-full border-gray-300"
                  >
                    <div className="flex items-center space-x-2">
                      <FaUsers
                        size={35}
                        className="bg-purple-600 rounded-full p-1.5 text-white"
                      />
                      <div>
                        <p className="text-xl font-bold">{group.groupName}</p>
                        <p className="text-sm text-gray-500">Group Chat</p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <div className="flex-1 bg-gray-100 overflow-y-auto p-4 space-y-4">
            {renderMessages.map((message) => {
              const sender =
                currentChatChannel === "group"
                  ? gettingUsers.find((user) => user.email === message.email)
                  : null;

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.email === email ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-[40%] text-sm sm:text-base p-3 text-justify rounded-lg shadow-md ${
                      message.email === email
                        ? "bg-blue-500 text-white"
                        : "bg-white  text-black"
                    }`}
                  >
                    {currentChatChannel === "group" &&
                      sender &&
                      message.email !== email && (
                        <p className="text-xs font-semibold mb-1 text-purple-600">
                          {sender.user_name}
                        </p>
                      )}
                      
                    <p className="text-sm">{message.message}</p>
                    <div className="flex mt-3 justify-end">
                      <p
                        className={`text-[12px] ${
                          message.email === email
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {message.time?.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t shadow items-center space-x-2 p-4">
            <div className="border p-1 flex items-center border-gray-400 rounded-full">
              <input
                value={collectingMessages}
                onChange={(e) => setcollectingMessages(e.target.value)}
                placeholder="Write a message..."
                className="w-full py-1 mx-3"
              />
              <button
                onClick={creatingMessages}
                className="text-white bg-blue-500 p-2 rounded-full"
              >
                <IoSendSharp size={25} />
              </button>
            </div>
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
              Select a chat to continue chatting
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
