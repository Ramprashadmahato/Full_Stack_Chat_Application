import React from "react";
import { MdAlternateEmail } from "react-icons/md";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center w-full px-3 py-2 mb-2 bg-gray-200 text-black rounded-lg cursor-pointer transition-colors duration-200 hover:bg-[#1d1931] hover:text-white"
    >
      <img
        src={user.image || "/default-avatar.png"} // fallback if no image
        alt={user.name}
        onError={(e) => (e.target.src = "/default-avatar.png")} // fallback if broken URL
        className="w-8 h-8 rounded-full mr-2 cursor-pointer object-cover"
      />
      <div>
        <p className="font-bold">{user.name}</p>
        <p className="flex items-center text-sm">
          <MdAlternateEmail className="mr-1" /> {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
