import React from "react";
import { FaUser } from "react-icons/fa";

function ChatSideNavbar({ migratingUser, setselectedUser }) {
  const email = JSON.parse(localStorage.getItem("user"))?.trim();
  const findingSingleUser = migratingUser.find((user) => user.email === email);

  return (
    <div>
      <div className="p-3 w-56 border-r h-screen">
        <p className="font-semibold">Welcome</p>
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
        {migratingUser
          .filter((user) => user.email !== email)
          .map((user) => (
            <>
              <div
                onClick={() => {
                  setselectedUser(user.email);
                  localStorage.setItem("receiver", user.email)
                }}
              >
                <p>{user.user_name}</p>
              </div>
            </>
          ))}
      </div>
    </div>
  );
}

export default ChatSideNavbar;
