import React from "react";
import { MdChat } from "react-icons/md";

const FloatingButton = ({ onClick }) => {
  return (
    <div className="">
      <button
        className=" bg-blue text-white   p-5  rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        onClick={onClick}
      >
        <MdChat size={26} className="text-[#000000] cursor-pointer" />
      </button>
    </div>
  );
};

export default FloatingButton;
