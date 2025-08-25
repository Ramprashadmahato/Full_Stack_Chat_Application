import React from "react";
import { IoEyeSharp } from "react-icons/io5";

const ProfileModel = ({ user, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!user) return null; // Prevent errors if user is undefined

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      {/* Trigger */}
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <button
          onClick={onOpen}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition duration-200 shadow-sm"
        >
          <IoEyeSharp size={20} className="text-gray-700" />
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-[90%] max-w-md relative shadow-2xl animate-scaleIn">
            {/* Header */}
            <div className="flex justify-center items-center text-xl font-semibold capitalize p-4 border-b border-gray-200 text-gray-800">
              {user.name || "Unknown User"}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
            >
              ✕
            </button>

            {/* Body */}
            <div className="flex flex-col items-center p-6 space-y-5">
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-indigo-500"
              />
              <p className="text-base md:text-lg text-gray-700">
                Email:{" "}
                <span className="font-medium text-gray-900">
                  {user.email || "Not Available"}
                </span>
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-center p-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModel;
