import React, { useEffect, useState } from "react";
import { FaBars, FaUser, FaUsers } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import CreateGroupForm from "./CreateGroupForm";
import { motion, useIsomorphicLayoutEffect } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { database } from "./FirebaseConfig";

function ChatSideNavbar({ migratingUser, setselectedUser, setselectedGroup }) {
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

    const filteredArray = multipleArray.filter((task) => task.email === email);
    setrenderingGroupDetails(multipleArray);
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
      <div className="sm:hidden">
        <button>
          <FaBars />
        </button>
      </div>
      <div className="p-3 hidden sm:block w-56 border-r h-screen">
        <div className="flex items-center pb-3 justify-between border-b border-gray-300">
          <p className="font-semibold">Welcome</p>
          <button
            onClick={() => {
              setopeningAdditionalBlock(!openingAdditionalBlock);
            }}
            className=""
          >
            <IoCreateOutline size={20} />
          </button>
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
          <div className="flex items-center space-x-2 p-4 border-b w-full border-gray-300">
            <FaUser className="text-[#333333]" size={30} />
            <p className="text-[#333333]">
              {findingSingleUser
                ? findingSingleUser.user_name
                : "Loading User...."}
            </p>
          </div>
        </div>
        <div>
          {renderingGroupDetails.map((group) => (
            <div
              onClick={() => {
                setselectedUser("");
                setselectedGroup(group.id);
                localStorage.setItem("selectedGroup", group.id);
              }}
              className="flex py-3 border-b border-gray-300 items-center justify-between"
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
                  className="border-b border-gray-300 py-3"
                  onClick={() => {
                    setselectedUser(user.email);
                    setselectedGroup("");
                    localStorage.setItem("receiver", user.email);
                  }}
                >
                  <p className="capitalize">{user.user_name}</p>
                </div>
              </>
            ))}
        </div>

        <div className="flex mt-60">
          <button
            onClick={() => {
              navigate("/");
              localStorage.clear();
            }}
            className="text-red-500 font-semibold"
          >
            Logout
          </button>
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
