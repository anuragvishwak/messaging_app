import React, { useState, useEffect, useRef } from "react";

const UserCheckboxDropdown = ({ users, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const dropdownRef = useRef();

  const toggleUser = (user) => {
    const exists = selected.find((u) => u.email === user.email);
    if (exists) {
      setSelected((prev) => prev.filter((u) => u.email !== user.email));
    } else {
      setSelected((prev) => [...prev, user]);
    }
  };

  useEffect(() => {
    onSelect(selected);
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-64 mt-1" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border p-2 rounded bg-white shadow cursor-pointer"
      >
        {selected.length === 0 ? "Select Users" : `${selected.length} selected`}
      </div>

      {isOpen && (
        <div className="absolute w-full z-10 bg-white shadow rounded mt-1 max-h-60 overflow-y-auto border">
          {users.map((user) => (
            <label
              key={user.email}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={!!selected.find((u) => u.email === user.email)}
                onChange={() => toggleUser(user)}
              />
              {user.user_name} ({user.email})
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1 mt-2">
        {selected.map((user) => (
          <span
            key={user.email}
            className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
          >
            {user.user_name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserCheckboxDropdown;
