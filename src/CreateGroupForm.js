import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { database } from "./FirebaseConfig";
import UserCheckboxDropdown from "./UserCheckboxDropdown";

function CreateGroupForm({ setopeningCreateGroupForm }) {
  const email = JSON.parse(localStorage.getItem("user"))?.trim();
  const [migratingUser, setmigratingUser] = React.useState([]);
  const [groupName, setGroupName] = React.useState("");
  const [groupDescription, setGroupDescription] = React.useState("");
  const [groupMembers, setGroupMembers] = React.useState([]);

  async function creatingGroup() {
    try {
      const allMembers = [...groupMembers.map((user) => user.email), email];

      const uniqueMembers = Array.from(new Set(allMembers));

      await addDoc(collection(database, "group_database"), {
        groupName,
        groupDescription,
        groupMembers: uniqueMembers,
        createdBy: email,
        time: new Date(),
      });

      alert("Group created successfully!");
      setopeningCreateGroupForm(false);
    } catch (error) {
      console.error("Error creating group: ", error);
    }
  }

  async function renderingUser() {
    const taskDetails = await getDocs(collection(database, "user_database"));
    let multipleArray = taskDetails.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredArray = multipleArray.filter((task) => task.email !== email);
    setmigratingUser(filteredArray);
  }

  useEffect(() => {
    renderingUser();
  }, []);

  return (
    <div className="bg-black z-50 flex flex-col justify-center items-center fixed inset-0 bg-opacity-70">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-1">
            <FaUsers size={35} />
            <p className="text-2xl font-semibold">Create Group</p>
          </div>
          <button
            onClick={() => {
              setopeningCreateGroupForm(false);
            }}
            className="text-red-500 font-bold"
          >
            Close
          </button>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div>
              <p className="text-gray-700">Group Name:</p>
              <input
                onChange={(e) => setGroupName(e.target.value)}
                type="text"
                className="p-2 border border-gray-300 rounded w-full"
                placeholder="Enter group name"
              />
            </div>
            <div>
              <p className="mt-1 text-gray-700">Select User:</p>
              <UserCheckboxDropdown
                users={migratingUser}
                onSelect={(selectedUsers) => setGroupMembers(selectedUsers)}
              />
            </div>
          </div>
          <div>
            <p className="text-gray-700">Group Description:</p>
            <textarea
              type="text"
              onChange={(e) => setGroupDescription(e.target.value)}
              className="p-2 border border-gray-300 h-40 rounded w-full"
              placeholder="Enter group Description"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              creatingGroup();
            }}
            className="bg-blue-400 text-white hover:bg-blue-700 py-1 mt-4 px-3 rounded"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupForm;
