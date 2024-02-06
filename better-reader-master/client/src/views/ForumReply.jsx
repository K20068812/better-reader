import axios from "axios";
import UserData from "../contexts/UserData";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { CONSTANT, getBookThumbnail, ICONS } from "../CONSTANT";
export default function ForumReply(props) {
  const [writeUp, setWriteUp] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const updateReply = async () => {
    if (writeUp !== "") {
      await axios
        .put(CONSTANT.server + `forumpostreplies/${props?.reply?.id}`, {
          reply: writeUp,
          forum: props?.reply?.forum?.id,
          user: props?.reply?.user?.id,
          mode:"replies"
        })
        .then((response) => {
          props.viewAllReplies();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteReply = async () => {
    await axios
      .delete(CONSTANT.server + `forumpostreplies/${props?.reply?.id}`)
      .then((response) => {
        props.viewAllReplies();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-4 flex items-center cursor-pointer hover:bg-gray-50 border-2 hover:border-emerald-500"
      key={props?.index}
    >
      {/* Avatar and username */}
      <div className="flex flex-col items-center mr-6">
        <Link
          to={`/profile/${props?.reply?.user?.id}`}
          className="flex items-center flex-col"
        >
          <img
            src={
              props?.reply?.user?.profile_picture &&
              props?.reply?.user?.profile_picture !== ""
                ? props?.reply?.user?.profile_picture
                : avatar
            }
            alt="User avatar"
            className="rounded-full w-16  mr-2"
          />

          <p className="text-gray-700 font-bold">
            {props?.reply?.user?.username}
          </p>
        </Link>
      </div>
      {/* Card info */}
      <div className="flex-1">
        {isEdit ? (
          <input
            value={writeUp}
            onChange={(e) => {
              setWriteUp(e.target.value);
            }}
            className="border w-full border-gray-500 px-2 py-1 rounded-lg"
          />
        ) : (
          <p className="text-gray-700 mb-4">{props?.reply?.reply}</p>
        )}
      </div>

      <div className="ml-5 flex flex-col items-end justify-center">
        <p className="text-gray-600">
          {new Date(props?.reply?.timestamp).toLocaleString()}
        </p>
        {props.isMe ? (
          !isEdit ? (
            <span className="flex flex-row">
              {ICONS.update(
                "h-6 w-6 text-green-900 transition-all hover:text-green-500 cursor-pointer",
                () => {
                  setIsEdit(true);
                  setWriteUp(props?.reply?.reply);
                }
              )}
              {ICONS.delete(
                "h-6 w-6 text-red-900 transition-all hover:text-red-500 cursor-pointer",
                () => {
                  deleteReply();
                }
              )}
            </span>
          ) : (
            <span className="flex flex-row">
              {ICONS.discard(
                "h-6 w-6 text-red-900 transition-all hover:text-red-500 cursor-pointer",
                () => {
                  setIsEdit(false);
                }
              )}
              {ICONS.correct(
                "h-6 w-6 text-green-900 transition-all hover:text-green-500 cursor-pointer",
                () => {
                  updateReply();
                  setWriteUp("");
                  setIsEdit(false);
                }
              )}
            </span>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
