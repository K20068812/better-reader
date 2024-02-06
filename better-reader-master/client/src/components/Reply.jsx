import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import avatar from "/assets/users/avatar.png";

export default function Reply(props) {
  const [writeUp, setWriteUp] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="mt-4 ml-12 w-full">
      <div className="flex w-full sha">
        {!props.input ? (
          <div className="w-12 h-10 rounded-full overflow-hidden mr-4">
            <img
              src={
                props.reply?.by_user?.profile_picture &&
                props.reply?.by_user?.profile_picture !== ""
                  ? props.reply?.by_user?.profile_picture
                  : avatar
              }
              alt="User Profile Pic"
            />
          </div>
        ) : (
          ""
        )}
        <div className="w-full">
          <div className="flex items-center mb-2">
            <Link
              to={`/profile/${props.reply?.by_user?.id}`}
              className="text-lg font-medium mr-2 hover:underline cursor-pointer"
            >
              {props.input
                ? ""
                : `${props?.reply?.by_user?.first_name} ${props?.reply?.by_user?.last_name}`}
            </Link>
            {!props.input ? (
              <span className="text-gray-600 text-sm">
                {props.timeAgo.format(new Date(props?.reply?.timestamp))}
              </span>
            ) : (
              ""
            )}
          </div>
          {props.input || isEdit ? (
            <input
              value={writeUp}
              onChange={(e) => {
                setWriteUp(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value !== "") {
                  if (isEdit) {
                    props.updateReply(
                      props.comment_id,
                      writeUp,
                      props.reply.id
                    );
                    setWriteUp("");
                    setIsEdit(false);
                  } else {
                    props.addReply(props.comment_id, writeUp);
                    setWriteUp("");
                  }
                }
              }}
              className="border w-full border-gray-500 px-2 py-1 rounded-lg"
            />
          ) : (
            <p className="text-gray-800">{props.reply.content}</p>
          )}
          <div className="mt-2 flex">
            {props.current === props?.reply?.by_user?.id ? (
              <>
                <button
                  onClick={() => {
                    setIsEdit((old) => {
                      if (!old) {
                        setWriteUp(props.reply.content);
                      } else {
                        setWriteUp("");
                      }
                      return !old;
                    });
                  }}
                  className="text-sm text-gray-600 mr-2 hover:text-gray-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    props.deleteReply(props?.reply?.id);
                  }}
                  className="text-sm text-gray-600 mr-2 hover:text-red-600"
                >
                  Delete
                </button>
              </>
            ) : (
              ""
            )}
            {props.input ? (
              <button
                onClick={() => {
                  if (isEdit) {
                    props.updateReply(
                      props.comment_id,
                      writeUp,
                      props.reply.id
                    );
                    setWriteUp("");
                    setIsEdit(false);
                  } else {
                    props.addReply(props.comment_id, writeUp);
                    setWriteUp("");
                  }
                }}
                className="text-sm text-gray-600 hover:text-red-600"
              >
                Send
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
