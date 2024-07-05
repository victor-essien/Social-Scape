import React, { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { Loading } from "../components";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LuSendHorizonal } from "react-icons/lu";
import { useLocation, useParams } from "react-router-dom";
import { NoDetails, CheckInternet } from "../components";
import { getMessageInfo, sendMessage } from "../utils";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";

const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Get the month and year
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${month} ${year}`;
};
const SendMessage = ({ onBack }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const chatDetails = location.state?.chatDetails;
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [newMessageTrigger, setNewMessageTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
 ;
  const { chatId } = useParams();
   const textareaRef = useRef(null);
  const token = user?.token;

  const socket = io("https://mern-socialscape.onrender.com", {
    auth: { token },
    transports: ["websocket", "polling"],
  });
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  
  useEffect(() => {
    const getMessage = async () => {
      setIsLoading(true);
      try {
       
        const res = await getMessageInfo(chatId);
       
        if (res.data) {
          setMessages(res.data);
        }
        if (res.message === "read ECONNRESET") {
          
        }
       
        setIsLoading(false);
      } catch (error) {
        
        setIsLoading(false);
        console.log(error);
      }
    };
    if (chatId) {
      
      getMessage();

      
    }
  }, [chatId, newMessageTrigger]);

 
  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (chatContainer) {
      const observer = new MutationObserver(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      });

      observer.observe(chatContainer, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
      };
    }
   
  }, [newMessageTrigger, messages]);

  socket.on("connect_error", (err) => {
    // the reason of the error, for example "xhr poll error"
    console.log(err.message);
  
    // some additional description, for example the status code of the initial HTTP response
    console.log(err.description);
  
    // some additional context, for example the XMLHttpRequest object
    console.log(err.context);
  });
  
  useEffect(() => {
    const socket = io("https://mern-socialscape.onrender.com", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      const transport = socket.io.engine.transport.name; 
      console.log(transport)
      console.log("Connected to the server");
    });
    console.log("socket", socket);
    
    socket.on("newMessage", async (data) => {
    
      setMessages((prevMessages) => {
    
        // Ensure prevMessages is always an array
        if (!Array.isArray(prevMessages)) {
          
          return [data]; // Reset state to an array with the new message
        }

        return [...prevMessages, data];
      });
      setNewMessageTrigger((prev) => prev + 1);
   
      // scrollDown()
    });

   

    socket.emit("joinChat", chatId);
    // socket.on("disconnect", (reason, details) => {
    //   // the reason of the disconnection, for example "transport error"
    //   console.log(reason);
    
    //   // the low-level reason of the disconnection, for example "xhr post error"
    //   console.log(details.message);
    
    //   // some additional description, for example the status code of the HTTP response
    //   console.log(details.description);
    
    //   // some additional context, for example the XMLHttpRequest object
    //   console.log(details.context);
    // });

    return () => {
      socket.disconnect();
    };
  }, []);
 

  const handleSend = async (recipients) => {
    const recipient = recipients;
    if (message !== "") {
      const messageData = { chatId, recipient, content: message };
     
      socket.emit("private message", messageData);
      setMessage("");
      setNewMessageTrigger((prev) => prev + 1);
      
    }
  };

  // if(messages.messages){
  //   console.log("nine")
  //   scrollDown()
  // }



  const createdAt = chatDetails.participant?.createdAt;
  const formattedDate = formatDate(createdAt);
  return (
    <div className="">
      {chatDetails && chatDetails.participant ? (
        <div className="w-full  items-center shadow-sm  px-1   ">
          <button
            onClick={onBack}
            className="md:hidden text-xl text-white hover:underline"
          >
            <IoMdArrowRoundBack />
          </button>
          <div className="overflow-y-auto">
            <div className="w-full px-6 flex flex-col items-center justify-between rounded-lg  border-b pb-1 lg:pt-9 lg:pb-5 border-[#66666645]">
              <Link to={"/profile/" + chatDetails.participant?._id}>
                <img
                  src={chatDetails.participant?.profileUrl ?? NoProfile}
                  alt={user?.email}
                  className="h-10 w-10 lg:w-20 lg:h-20 object-cover rounded-full"
                />
              </Link>
              <p className="text-lg font-medium text-ascent-1">
                {chatDetails.participant?.firstName}{" "}
                {chatDetails.participant?.lastName}
              </p>
              <span className="text-ascent-1">
                {chatDetails.participant?.profession ?? "No Profession"}
              </span>
              <p className="text-ascent-2">Joined {formattedDate} .</p>
            </div>

            <div className=" ">
              <div
                ref={chatContainerRef}
                className="h-[23rem] lg:h-[18rem] px-6 pb-14 overflow-y-scroll"
              >
                {messages.messages ? (
                  messages.messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex mb-4 ${
                        message.sender._id === user._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`relative max-w-xs ${
                          message.sender._id === user._id
                            ? "bg-blue"
                            : "bg-primary"
                        } text-white p-4 rounded-lg shadow-lg`}
                      >
                        <span>{message.content}</span>
                        <div
                          className={`absolute bottom-0 ${
                            message.sender._id === user._id
                              ? "right-0"
                              : "left-0"
                          } w-0 h-0 border-t-8 ${
                            message.sender._id === user._id
                              ? "border-t-blue-500"
                              : "border-t-gray-300"
                          } border-r-8 ${
                            message.sender._id === user._id
                              ? "border-r-transparent"
                              : "border-l-transparent"
                          } border-b-8 border-b-transparent`}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <CheckInternet />
                )}
                {isLoading && <Loading />}
              </div>
              <div className="border-b  border-[#66666645]"></div>
            </div>
          </div>

          <div className="fixed bottom-0  w-[90%] b lg:w-[34rem] pb-3 px-3 lg:px-0 lg:pb-2" >
            <div className="messagebar  flex flex-row rounded-3xl justify-center    items-center  bg-secondary border border-[#66666690]   ">
              <textarea
                type="text"
                ref={textareaRef}
                placeholder="Start a new message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="  bg-secondary lg:w-[70%] w-[69%] p-4 outline-none text-lg text-ascent-1 resize-none overflow-hidden transition-height duration-300 ease-in-out "
                style={{ minHeight: '49px' }}
                rows="1"
              />
              <LuSendHorizonal
                size={26}
                className="text-blue  cursor-pointer"
                onClick={() => handleSend(chatDetails.participant?._id)}
              />
              {/* <TextInput
          placeholder='Start a new message'
          styles='messagebar  w-1/4  rounded-l-full py-3 mb-9'
         
        /> */}
            </div>
          </div>
        </div>
      ) : (
        <NoDetails />
      )}
    </div>
  );
};

export default SendMessage;
