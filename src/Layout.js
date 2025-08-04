import React, { useEffect, useState } from "react";
import ChatSideNavbar from "./ChatSideNavbar";
import MainChat from "./MainChat";
import { collection, getDocs } from "firebase/firestore";
import { database } from "./FirebaseConfig";
import UseWindowSize from "./UseWindowSize";

function Layout() {
  const [selectedUser, setselectedUser] = useState("");
  const [selectedGroup, setselectedGroup] = useState("");
  const [migratingUser, setmigratingUser] = useState([]);
  const [currentChatChannel, setcurrentChatChannel] = useState("single");
  const [handlingResponsive, sethandlingResponsive] = useState(
    localStorage.getItem("handlingResponsive") || "nav"
  );

  const screenWidth =UseWindowSize (); 
  const isMobile = screenWidth < 768;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const userDocs = await getDocs(collection(database, "user_database"));
        const users = userDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setmigratingUser(users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="w-full h-screen">
      {isMobile ? (
        handlingResponsive === "nav" ? (
          <ChatSideNavbar
            setselectedUser={setselectedUser}
            setselectedGroup={setselectedGroup}
            currentChatChannel={currentChatChannel}
            setcurrentChatChannel={setcurrentChatChannel}
            sethandlingResponsive={sethandlingResponsive}
            migratingUser={migratingUser}
          />
        ) : (
          <MainChat
            selectedUser={selectedUser}
            selectedGroup={selectedGroup}
            currentChatChannel={currentChatChannel}
            setselectedUser={setselectedUser}
            setselectedGroup={setselectedGroup}
            setcurrentChatChannel={setcurrentChatChannel}
            handlingResponsive={handlingResponsive}
            sethandlingResponsive={sethandlingResponsive}
            setmigratingUser={setmigratingUser}
            migratingUser={migratingUser}
          />
        )
      ) : (
        <div className="flex h-full">
          <div className="w-[25%] min-w-[250px] border-r border-gray-300">
            <ChatSideNavbar
              setselectedUser={setselectedUser}
              setselectedGroup={setselectedGroup}
              currentChatChannel={currentChatChannel}
              setcurrentChatChannel={setcurrentChatChannel}
              sethandlingResponsive={sethandlingResponsive}
              migratingUser={migratingUser}
            />
          </div>
          <div className="flex-1">
            <MainChat
              selectedUser={selectedUser}
              selectedGroup={selectedGroup}
              currentChatChannel={currentChatChannel}
              setselectedUser={setselectedUser}
              setselectedGroup={setselectedGroup}
              setcurrentChatChannel={setcurrentChatChannel}
              handlingResponsive={handlingResponsive}
              sethandlingResponsive={sethandlingResponsive}
              setmigratingUser={setmigratingUser}
              migratingUser={migratingUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
