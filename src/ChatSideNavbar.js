import React, { useEffect, useState } from "react";
import { FaBars, FaUser, FaUsers } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import CreateGroupForm from "./CreateGroupForm";
import { motion, useIsomorphicLayoutEffect } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { database } from "./FirebaseConfig";
import { BiLogOut } from "react-icons/bi";

function ChatSideNavbar({
  migratingUser,
  setselectedUser,
  setselectedGroup,
  setcurrentChatChannel,
  sethandlingResponsive,
}) {
  const navigate = useNavigate();
  const email = JSON.parse(localStorage.getItem("user"))?.trim();
  const findingSingleUser = migratingUser.find((user) => user.email === email);
  const [openingAdditionalBlock, setopeningAdditionalBlock] = useState(false);
  const [openingCreateGroupForm, setopeningCreateGroupForm] = useState(false);
  const [renderingGroupDetails, setrenderingGroupDetails] = useState([]);
  const [renderingGroupMessages, setrenderingGroupMessages] = useState([]);

  async function gatheringGroupDetails() {
    const taskDetails = await getDocs(collection(database, "group_database"));
    let multipleArray = taskDetails.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredGroups = multipleArray.filter((group) =>
      group.groupMembers.includes(email)
    );

    setrenderingGroupDetails(filteredGroups);
  }

  async function gatheringGroupMessages() {
    const taskDetails = await getDocs(
      collection(database, "group_message_database")
    );
    let multipleArray = taskDetails.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredArray = multipleArray.filter((task) => task.email === email);
    setrenderingGroupMessages(multipleArray);
  }

  useEffect(() => {
    gatheringGroupDetails();
    gatheringGroupMessages();
  }, []);

  return (
    <div>
      <div className="p-3 border-r h-screen">
        <div className="flex items-center pb-3 justify-between border-b border-gray-300">
          <p className="font-semibold text-blue-500 text-xl">Messages</p>
          <div className="flex items-center space-x-2">
            <button
            onClick={() => {
              setopeningAdditionalBlock(!openingAdditionalBlock);
            }}
            className=""
          >
            <IoCreateOutline size={20} />
          </button>
            <button
            onClick={() => {
              navigate("/");
              localStorage.clear();
            }}
            className="text-red-500 font-semibold"
          >
            <BiLogOut  size={23}/>
          </button>
          </div>
        </div>
        {openingAdditionalBlock && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <button className="my-1">
              <div className="flex items-center space-x-1">
                <FaUser size={15} />
                <p>Add User</p>
              </div>
            </button>
            <button
              onClick={() => {
                setopeningCreateGroupForm(!openingCreateGroupForm);
                setopeningAdditionalBlock(false);
              }}
            >
              <div className="flex items-center space-x-1">
                <FaUsers size={20} />
                <p>Create Group</p>
              </div>
            </button>
          </motion.div>
        )}
        <div>
          <div className="flex items-center space-x-2 p-4  w-full border-gray-300">
            <FaUser className="text-white bg-[#333333] p-1.5 rounded-full" size={35} />
            <div>
              <p className="text-[#333333] font-bold">
              {findingSingleUser
                ? findingSingleUser.user_name
                : "Loading User...."}
            </p>
            <p className="text-green-500 text-sm">Online</p>
            </div>
          </div>

          <input placeholder="Search Conversations...." className="w-full border border-gray-400 mb-5 rounded p-1"></input>
        </div>
        <div className="border-t border-gray-300">
          <p className="font-semibold text-lg text-gray-400 py-3 ">YOUR CHATS</p>
        </div>
        <div>
          {renderingGroupDetails.map((group) => (
            <div
              onClick={() => {
                setselectedUser("");
                setselectedGroup(group.id);
                setcurrentChatChannel("group");
                localStorage.setItem("selectedGroup", group.id);
                sethandlingResponsive("user");
              }}
              className="flex py-1.5 items-center justify-between"
            >
              <p className="">{group.groupName}</p>
              <FaUsers />
            </div>
          ))}
          {migratingUser
            .filter((user) => user.email !== email)
            .map((user) => (
              <>
                <div
                  className="py-1.5"
                  onClick={() => {
                    setselectedUser(user.email);
                    setselectedGroup("");
                    setcurrentChatChannel("single");
                    localStorage.setItem("receiver", user.email);
                    sethandlingResponsive("user");
                  }}
                >
                  <p className="capitalize">{user.user_name}</p>
                </div>
              </>
            ))}
        </div>

       
      </div>

      {openingCreateGroupForm && (
        <CreateGroupForm
          setopeningCreateGroupForm={setopeningCreateGroupForm}
        />
      )}
    </div>
  );
}

export default ChatSideNavbar;
