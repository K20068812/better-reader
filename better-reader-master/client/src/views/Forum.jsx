import axios from "axios";
import UserData from "../contexts/UserData";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import avatar from "/assets/avatar.png";
import { CONSTANT } from "../CONSTANT";
const Forum = () => {
  const { session, setSession, refreshSession } = useContext(UserData);

  const __INIT__ = {
    title: "",
    text: "",
  };
  const [credentials, setCredentials] = useState(__INIT__);
  const changeCredentials = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const addForumPost = async () => {
    await axios
      .post(CONSTANT.server + `forumpost`, {
        title: credentials.title,
        text: credentials.text,
        user: session?.personal?.id,
      })
      .then((response) => {
        viewForumPosts();
        setCredentials(__INIT__);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [forumPosts, setForumPosts] = useState([]);
  const viewForumPosts = async () => {
    await axios
      .get(CONSTANT.server + `forumpost`)
      .then((response) => {
        setForumPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    viewForumPosts();
  }, []);

  return (
    <div className="flex flex-col mb-10">
      {/* First section */}
      <div className=" py-6 px-4 w-full">
        <div className=" max-w-6xl mx-auto bg-red-200">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
              Create a new post
            </h1>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block font-bold text-gray-700 mb-2"
              >
                Enter Title
              </label>
              <input
                type="text"
                value={credentials.title}
                onChange={changeCredentials}
                name="title"
                className="w-full p-2 h-11 border-gray-300 rounded-md shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="text"
                className="block font-bold text-gray-700 mb-2"
              >
                Enter Text
              </label>
              <textarea
                value={credentials.text}
                onChange={changeCredentials}
                name="text"
                rows="2"
                className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex w-full justify-end">
              <button
                onClick={addForumPost}
                disabled={credentials.title === "" || credentials.text === ""}
                className={`${
                  credentials.title === "" || credentials.text === ""
                    ? "pointer-events-none"
                    : ""
                } bg-blue-600 text-white font-bold py-3 px-12 rounded hover:bg-blue-700 text-lg`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Second section */}
      <div className="">
        <div className="max-w-5xl mx-auto py-8 ">
          <div className="flex flex-col space-y-6">
            {/* Card list */}
            {forumPosts.map((forum, index) => {
              return (
                <Link to={`/forum/${forum?.id}`}>
                  <div
                    className="bg-white rounded-lg shadow-lg p-4 flex items-center cursor-pointer hover:bg-gray-50 border-2 hover:border-emerald-500"
                    key={index}
                  >
                    {/* Avatar and username */}
                    <div className="flex flex-col items-center mr-6">
                      <Link
                        to={`/profile/${forum?.user?.id}`}
                        className="flex items-center flex-col"
                      >
                        <img
                          src={
                            forum?.user?.profile_picture &&
                            forum?.user?.profile_picture !== ""
                              ? forum?.user?.profile_picture
                              : avatar
                          }
                          alt="User avatar"
                          className="rounded-full w-16  mr-2"
                        />
                        <p className="text-gray-700 font-bold">
                          {forum?.user?.username}
                        </p>
                      </Link>
                    </div>
                    {/* Card info */}
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-2">{forum?.title}</p>
                      <p className="text-gray-700 mb-4">
                        {forum?.first_reply?.reply === ""
                          ? "No reply yet..."
                          : forum?.first_reply?.reply}
                      </p>
                    </div>

                    <div className="flex flex-col items-start justify-center">
                      <p className="text-gray-600">
                        {new Date(forum?.timestamp).toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        {forum?.no_of_replies} replies sent
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
