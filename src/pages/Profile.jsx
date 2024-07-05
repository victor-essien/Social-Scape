import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";
import { BsBriefcase } from "react-icons/bs";
import { BsPersonFillAdd } from "react-icons/bs";

import {
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TopBar,
  EditProfile,
} from "../components";
import { CiLocationOn } from "react-icons/ci";
import { NoProfile } from "../assets";
import { deletePost, fetchPosts, getUserInfo, likePost } from "../utils";
import { UpdateProfile } from "../redux/userSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user: data, edit } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);

  const uri = "/posts/get-user-post/" + id;

  const getUser = async () => {
    const res = await getUserInfo(user?.token, id);
    setUserInfo(res);
  };
  const getPosts = async () => {
    await fetchPosts(user.token, dispatch, uri);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deletePost(id, user.token);
    await getPosts();
  };
  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });

    await getPosts();
  };

 
  useEffect(() => {
    setLoading(true);
    getUser();
    getPosts();
  }, [id]);

  return (
    <>
      <div className="w-full px-0 lg:px-10 lg:pb-20 pb-28 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden sm:overflow-y-auto">
        <TopBar />

        <div className="w-full flex  gap-2 lg:gap-4 md:pl-4 pt-5 lg:pb-1 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={userInfo} />

            <div className="block lg:hidden">
              <FriendsCard friends={userInfo?.friends} />
            </div>
          </div>

          {/* CENTER */}
          <div className=" flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            {/* TOPUSERDETAILS */}

            <div className=" mt-3 px-6 lg:hidden  rounded-lg bg-primary">
              <div className="  flex items-center gap-2 py-3 border-b border-[#66666645]">
                <img
                  src={userInfo?.profileUrl ?? NoProfile}
                  alt="User Image"
                  className="w-28 h-28 rounded-full object-cover "
                />
                <div className="lg:hidden">
                  {user?._id === data?._id ? (
                    <LiaEditSolid
                      size={22}
                      className="text-blue cursor-pointer"
                      onClick={() => dispatch(UpdateProfile(true))}
                    />
                  ) : (
                    <button
                      className="bg-[#0444a430] text-sm text-white p-1 rounded"
                      onClick={() => {}}
                    >
                      <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                    </button>
                  )}
                </div>
              </div>
              <div className="">
                <p className="text-2xl font-medium text-ascent-1">
                  {userInfo?.firstName} {userInfo?.lastName}
                </p>
                <div className="flex gap-2 items-center text-ascent-2">
                  <CiLocationOn className="text-xl text-ascent-1" />
                  <span>{userInfo?.location ?? "Add Location"}</span>
                </div>
                <div className="flex gap-2 items-center text-ascent-2">
                  <BsBriefcase className=" text-lg text-ascent-1" />
                  <span>{userInfo?.profession ?? "Add Profession"}</span>
                </div>

                <p className="text-ascent-1 text-xl font-bold">
                  {userInfo?.friends?.length}{" "}
                  <span className="text-ascent-2">Friends</span>
                </p>
              </div>
            </div>
            <div className="block lg:hidden">
              <FriendsCard friends={userInfo?.friends} />
            </div>

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      </div>
      {edit && <EditProfile />}
    </>
  );
};

export default Profile;
