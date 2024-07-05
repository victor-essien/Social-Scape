import React from "react";
import TextInput from "./TextInput";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleCreateChat } from "../utils";
import { apiRequest } from "../utils";
import { CreateChat } from "../redux/userSlice";
import Loading from "./Loading";
import { getUserInfo } from "../utils";
import { UserLogin } from "../redux/userSlice";
const NewMessage = ({ friends }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { user } = useSelector((state) => state.user);

  const handleCreateMessage = async (userId, friendId) => {
    setIsSubmitting(true);
    setErrMsg("");
    try {
      const res = await handleCreateChat(userId, friendId);
      const chatData = res.data;

      const chatId = chatData._id;

      const rest = await apiRequest({
        url: "/messages/chats",
        method: "POST",

        data: {
          chatId,
          userId,
        },
      });
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        await getUser();
        setTimeout(() => {
          dispatch(CreateChat(false));
        }, 3000);
      }
      setIsSubmitting(false);
     
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  };
  const getUser = async () => {
    const res = await getUserInfo(user?.token);
    const newData = { token: user?.token, ...res };

    dispatch(UserLogin(newData));
  };
  useEffect(() => {
    getUser()
  }, []);

  const handleClose = () => {
    dispatch(CreateChat(false));
  };

  //   const createRecipient = async () => {

  //     try {
  //         const res = await apiRequest({
  //             url: "/messages/chats",
  //             method: "POST",
  //             data: {
  //                 chatId,
  //                 userId : user._id
  //             }
  //         });
  //         console.log('res', res)
  //         console.log('ressend', res.data)

  //     } catch (error) {
  //         console.log(error)
  //     }
  //   }


  return (
    <>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4  px-4 p-20 text-center sm:block  sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-[#000] opacity-80"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <div
            className="inline-block align-bottom sm:px-5 w-3/4 bg-[#0c0b0b] pb-44 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block font-medium text-xl text-ascent-1 text-left"
              >
                New Message
              </label>

              <button className="text-ascent-1" onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>
            <TextInput
              name="Search"
              placeholder="Search Friends"
              type="text"
              styles="w-full"
            />
            {isSubmitting ? (
              <Loading />
            ) : (
              <div className="w-full flex flex-col gap-4 pt-4 pl-3">
                {friends?.map((friend) => (
                  <>
                    <div className="flex w-full gap-4 items-center">
                      <Link
                        to={"/profile/" + friend?._id}
                        key={friend?._id}
                        className="cursor-pointer"
                      >
                        <img
                          src={friend?.profileUrl ?? NoProfile}
                          alt={friend?.firstName}
                          className="w-10 h-10 object-cover rounded-full"
                        />{" "}
                      </Link>
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          handleCreateMessage(user?._id, friend._id)
                        }
                      >
                        <p className="text-base font-medium text-ascent-1">
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </div>
                    {/* <button onClick={() => createChat(user?._id, friend._id)}> 
            Message
           </button> */}
                  </>
                ))}
              </div>
            )}
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default NewMessage;

{
  /* <button className='text-white' onClick={onClose}>Close</button> */
}
