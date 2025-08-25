import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full h-full bg-gray-50">
      <div
        className="
          animate-spin
          rounded-full
          h-16 w-16
          border-4 border-t-4
          border-indigo-500 border-t-transparent
          shadow-md
        "
        style={{ animationDuration: "0.6s" }}
      ></div>
      <span className="ml-4 text-indigo-600 font-semibold text-lg animate-pulse">
        Loading...
      </span>
    </div>
  );
};

export default Loader;
