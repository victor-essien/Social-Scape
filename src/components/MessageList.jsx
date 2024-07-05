import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserLogin } from "../redux/userSlice";
import { getUserInfo } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { NoProfile } from "../assets";
import FloatingButton from "./FloatingButton";
import NewMessage from "./NewMessage";
import { Loading } from "../components";
import { CreateChat } from "../redux/userSlice";
import {NoDetails} from "../components";
const MessageList = ({ chatRecipients, onChatSelect }) => {
  const { user, isOpen } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [recipient, setRecipients] = useState([]);
  const [chatInfo, setChatInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const dispatch = useDispatch();
  const handleButtonClick = () => {
    dispatch(CreateChat(true));
  };

  const handleMessageClick = (chatId, chatRecipient) => {
    navigate(`/messages/${chatId}`, { state: { chatDetails: chatRecipient } });
    onChatSelect();
  };

  //     useEffect (()=> {
  //    setLoading(true)
  //       getUser()

  // }, []);

  //  const createChatList = async () => {
  //   const chatId = chatInfo._id
  //   const userId = user?._id
  //   console.log(chatId)
  //   try {
  //     const res = await apiRequest({
  //       url: "/messages/chats",
  //       chatId,
  //       userId,
  //       method:"POST",
  //       })
  //     console.log('sendCreateChat', res)
  //       return res;
  //     } catch (error) {
  //     console.log(error)
  //   }
  //  }

  // useEffect(() => {
  //   const fetchRecipients = async () => {
  //     try {
  //       const response = await axios.post('/api/chat/getChatList', {
  //         chatId,
  //         userId: user._id,
  //       });

  //       if (response.data.success) {
  //         setRecipients(response.data.data); // Assuming the backend returns multiple recipients
  //       } else {
  //         console.error('Failed to fetch recipient details');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching recipient details:', error);
  //     }
  //   };

  //   if (chatId && user._id) {
  //     fetchRecipients();
  //   }
  // }, [chatId, user._id]);
  console.log(user);
  console.log(chatRecipients);
  return (
    <div>
      <div className="pl-1 lg:text-left">
        <h1 className="text-2xl font-medium text-ascent-1">Messages</h1>
      </div>
      <div className="">
        <div className="   py-4  rounded-lg ">
          <div>
            {chatRecipients.length !== 0 ? (
            chatRecipients?.map((chatRecipient, index) => (
              <>
                <div
                  className="flex items-center space-x-2 p-4 mb-1 "
                  key={index}
                >
                  <Link
                    to={"/profile/" + chatRecipient.participant?._id}
                    key={chatRecipient.participant?._id}
                    className="cursor-pointer"
                  >
                    <img
                      src={chatRecipient.participant?.profileUrl ?? NoProfile}
                      alt={chatRecipient.participant?.email}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </Link>

                  <div
                    className="flex-1   min-w-0  sm:text-leftcursor-pointer"
                    onClick={() =>
                      handleMessageClick(chatRecipient.chatId, chatRecipient)
                    }
                  >
                    <p className="text-base font-medium text-ascent-1 cursor-pointer whitespace-nowrap">
                      {chatRecipient.participant?.firstName}{" "}
                      {chatRecipient.participant?.lastName}
                    </p>
                    <p className="text-ascent-1">Okay</p>
                  </div>
                </div>
              </>
            ))
          ) : (
            <div className="lg:hidden px-2 md:hidden">
            <NoDetails/>
            </div>
          )}
          </div>
        </div>
      </div>
      <div className=" fixed bottom-4 left-3/4 lg:left-[45%]">
        <FloatingButton onClick={handleButtonClick} />
      </div>
      {isOpen && <NewMessage friends={user?.friends} />}
    </div>
  );
};

export default MessageList;
