import React from "react";
import { IoMdClose } from "react-icons/io";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-lg mr-2 mt-2">
      <span className="mr-2 font-medium">{user.name || "Unknown User"}</span>
      <IoMdClose
        onClick={handleFunction}
        className="cursor-pointer hover:text-red-600 transition-colors duration-200"
      />
    </div>
  );
};

export default UserBadgeItem;
