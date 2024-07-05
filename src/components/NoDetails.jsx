import React from "react";

const NoDetails = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 lg:pt-44 px-1 gap-3">
      <div className="font-bold text-lg lg:text-3xl text-ascent-1">
        Select a message
      </div>
      <p className="text-[#969696] text-base">
        Choose from your existing conversations, start a new one, or just keep
        swimming.
      </p>
    </div>
  );
};

export default NoDetails;
