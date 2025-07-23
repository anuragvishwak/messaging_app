import React from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ChatSideNavbar({ migratingUser, setselectedUser }) {
  const navigate = useNavigate();
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
      <div>
          {migratingUser
          .filter((user) => user.email !== email)
          .map((user) => (
            <>
              <div
              className="border-b border-gray-300 py-3"
                onClick={() => {
                  setselectedUser(user.email);
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
    </div>
  );
}

export default ChatSideNavbar;
