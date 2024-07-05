import React, { useState, useEffect } from "react";
import { MessageList, ProfileCard, SendMessage, TopBar } from "../components";
import { apiRequest } from "../utils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { NoDetails } from "../components";
const Message = () => {
  const [messages, setMessages] = useState([]);
  const { user, edit } = useSelector((state) => state.user);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [showChatList, setShowChatList] = useState(true);

 
  // Toggle the visibility of chat list on smaller screens
  const hanldeBackClick = () => {
    navigate("/messages");
    setShowChatList(true);
  };

  useEffect(() => {
    if (chatId) {
      setShowChatList(false);
    } else {
      setShowChatList(true);
    }
  }, [chatId]);
  return (
    <>
      <div className=" sm:pb-0 w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />

        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 h-screen lg:flex  flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} />
          </div>
          {/* CENTER */}
          <div
            className={`h-screen   bg-bgColor lg:w-1/3 lg:border-r-2  border-[#66666645] ${
              showChatList ? "block" : "hidden"
            }  md:block`}
          >
            <MessageList
              onChatSelect={() => setShowChatList(false)}
              chatRecipients={user?.chatRecipients}
            />
          </div>

          {/* RIGHT */}
          <div className={`${showChatList ? "hidden" : "block"} h-screen md:flex flex-col w-full   lg:w-2/4 `}>
            {chatId ? (
              <SendMessage
                onBack={hanldeBackClick}
                chatRecipients={user?.chatRecipients}
              />
            ) : (
              <div className={`${showChatList ? "hidden" : "block"}  md:block`}>
                <NoDetails />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
