import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TbSocial } from "react-icons/tb";
import { Link } from "react-router-dom";
import { TextInput, CustomButton } from "../components";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdHome, IoMdNotificationsOutline } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { IoMdMail } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { fetchPosts } from "../utils";
const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleSearch = async (data) => {
    await fetchPosts(user.token, dispatch, "", data);
  };
  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  return (
    <div className="py-3 md:py-6 px-4 bg-primary">
      <div className="topbar w-full flex items-center justify-between ">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 bg-[#065ad8] rounded text-white">
            <TbSocial />
          </div>
          <span className="text-2xl text-[#065ad8] font-semibold">
            SocialScape
          </span>
        </Link>

        <form
          className="hidden md:flex items-center justify-center"
          onSubmit={handleSubmit(handleSearch)}
        >
          <TextInput
            placeholder="Search..."
            styles="w-[18rem] lg:w-[38rem]  rounded-l-full py-3 "
            register={register("search")}
          />
          <CustomButton
            title="Search"
            type="submit"
            containerStyles="bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full"
          />
        </form>
        {/* ICONS */}
        <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
          <button onClick={() => handleTheme()}>
            {theme === "dark" ? <BsMoon /> : <BsSunFill />}
          </button>
          <div className="hidden lg:flex">
            <IoMdNotificationsOutline />
          </div>
          <div>
            <CustomButton
              onClick={() => dispatch(Logout())}
              title="Log Out"
              containerStyles="text-sm text-ascent-q px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
            />
          </div>
        </div>
      </div>
      <div className=" flex justify-around pt-4 lg:hidden ">
        <Link to={"/"}>
          <IoMdHome className="text-4xl  pt-1  text font-medium  text-ascent-2 cursor-pointer" />
        </Link>

        <Link to={"/friendRequest"}>
          <FaUserFriends className="text-4xl pt-1 pb-1 text font-medium  text-ascent-2 cursor-pointer" />
        </Link>
        <Link to={"/messages"}>
          <BiMessageRoundedDetail className="text-4xl pt-1 pb-1 text font-medium  text-ascent-2 cursor-pointer" />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
