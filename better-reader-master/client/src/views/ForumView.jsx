import axios from "axios";
import UserData from "../contexts/UserData";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import avatar from "/assets/avatar.png";
import { CONSTANT, ICONS } from "../CONSTANT";
import ForumReply from "./ForumReply";
const ForumView = () => {
  const { session, setSession, refreshSession } = useContext(UserData);
  const { forum_id: forum_id } = useParams();
  let navigate = useNavigate();

  const [forumPosts, setForumPosts] = useState({
    title: "",
    text: "",
  });
  const viewForumPosts = async () => {
    if (forum_id !== "") {
      await axios
        .put(CONSTANT.server + `forumpost`, {
          forum: forum_id,
        })
        .then((response) => {
          setForumPosts(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (session.isLoggedIn) {
      viewForumPosts();
      viewAllReplies();
    }
  }, [session]);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);

  const addReply = async () => {
    await axios
      .post(CONSTANT.server + `forumpostreplies`, {
        forum: forum_id,
        reply: reply,
        user: session?.personal?.id,
      })
      .then((response) => {
        viewAllReplies();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const viewAllReplies = async () => {
    await axios
      .get(CONSTANT.server + `forumpostreplies/${forum_id}`)
      .then((response) => {
        setReplies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePost = async (forum_id = forum_id) => {
    await axios
      .delete(CONSTANT.server + `forumpost/${forum_id}`)
      .then((response) => {
        navigate("/forum");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatePost = async (forum_id = forum_id) => {
    if (credentials.title !== "" && credentials.text !== "") {
      await axios
        .put(CONSTANT.server + `forumpostreplies/${forum_id}`, {
          title: credentials.title,
          text: credentials.text,
          user: session?.personal?.id,
          mode:"posts"
        })
        .then((response) => {
          viewForumPosts();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const [isEdit, setIsEdit] = useState(false);

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

  return (
    <div className="flex flex-col mb-10">
      {/* First section */}
      <div className=" py-6 w-full">
        <div className="bg-red-200">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-row justify-between">
              <h1 className="text-md font-semibold text-gray-800 mb-4">
                Forum post by{" "}
                <Link
                  to={`/profile/${forumPosts?.user?.id}`}
                  className="hover:text-gray-500"
                >
                  @{forumPosts?.user?.username}
                </Link>
              </h1>
              {forumPosts?.user?.id === session?.personal?.id &&
                (!isEdit ? (
                  <span className="flex flex-row">
                    {ICONS.delete(
                      "h-8 w-8 text-red-900 transition-all hover:text-red-500 cursor-pointer",
                      () => {
                        deletePost(forum_id);
                      }
                    )}
                    {ICONS.update(
                      "h-8 w-8 text-green-900 transition-all hover:text-green-500 cursor-pointer",
                      () => {
                        setCredentials({
                          title: forumPosts?.title,
                          text: forumPosts?.text,
                        });
                        setIsEdit(true);
                      }
                    )}
                  </span>
                ) : (
                  <span className="flex flex-row">
                    {ICONS.discard(
                      "h-8 w-8 text-red-900 transition-all hover:text-red-500 cursor-pointer",
                      () => {
                        setIsEdit(false);
                      }
                    )}
                    {ICONS.correct(
                      "h-8 w-8 text-green-900 transition-all hover:text-green-500 cursor-pointer",
                      () => {
                        updatePost(forum_id);
                        setCredentials(__INIT__);
                        setIsEdit(false);
                      }
                    )}
                  </span>
                ))}
            </div>
            {isEdit && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block font-bold text-gray-700 mb-2"
                  >
                    Title
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
                    Text
                  </label>
                  <textarea
                    value={credentials.text}
                    onChange={changeCredentials}
                    name="text"
                    rows="2"
                    className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </>
            )}
            {!isEdit && (
              <>
                <div className="mb-4 text-3xl font-bold">
                  {forumPosts?.title}
                </div>
                <div className="mb-4 text-xl">{forumPosts?.text}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mb-10 bg-white rounded-lg shadow-lg p-6 flex flex-row items-center justify-center">
        <input
          type="text"
          value={reply}
          placeholder="Reply here..."
          onChange={(e) => {
            setReply(e.target.value);
          }}
          className="w-full p-2 focus:outline-none h-11 border-gray-300 rounded-md shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <button
          onClick={addReply}
          disabled={reply === ""}
          className={`${
            reply === "" ? "pointer-events-none" : ""
          } bg-blue-600 ml-3 w-fit h-fit text-white font-bold py-3 px-12 rounded hover:bg-blue-700 text-lg`}
        >
          Reply
        </button>
      </div>
      <div className="space-y-4">
        {replies.map((reply, index) => {
          return (
            <ForumReply
              reply={reply}
              index={index}
              key={index}
              viewAllReplies={viewAllReplies}
              isMe={reply?.user?.id === session?.personal?.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ForumView;
