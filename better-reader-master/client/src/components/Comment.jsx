import React, { useState } from "react";

import avatar from "/assets/users/avatar.png";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Reply from "./Reply";
import { Link } from "react-router-dom";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");
export default function Comment(props) {
  const [isEdit, setIsEdit] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [writeUp, setWriteUp] = useState("");

  return (
    <div className="flex shadow rounded  p-4 border-gray-200 w-full">
      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
        <img
          src={
            props.comment.by_user?.profile_picture &&
            props.comment.by_user?.profile_picture !== ""
              ? props.comment.by_user?.profile_picture
              : avatar
          }
          alt="A"
        />
      </div>
      <div>
        <div className="flex items-center mb-2">
          <Link
            to={`/profile/${props.comment.by_user?.id}`}
            className="text-lg font-medium mr-2 hover:underline cursor-pointer"
          >
            {props.comment.by_user?.first_name}{" "}
            {props.comment.by_user?.last_name}
          </Link>
          <span className="text-gray-600 text-sm">
            {timeAgo.format(new Date(props.comment.timestamp))}
          </span>
        </div>
        {isEdit ? (
          <input
            value={writeUp}
            onChange={(e) => {
              setWriteUp(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value !== "") {
                props.updateComment(writeUp, props.comment.id);
                setIsEdit(false);
              }
            }}
            className="border w-full border-gray-500 px-2 py-1 rounded-lg"
          />
        ) : (
          <p className="text-gray-800">{props.comment.content}</p>
        )}
        <div className="mt-2 flex">
          {props.current === props.comment.by_user?.id ? (
            <>
              <button
                onClick={() => {
                  setIsEdit((old) => {
                    if (!old) {
                      setWriteUp(props.comment.content);
                    } else {
                      setWriteUp("");
                    }
                    return !old;
                  });
                }}
                className="text-sm text-gray-600 mr-2 hover:text-gray-800"
              >
                {isEdit ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={() => {
                  if (isEdit) {
                    props.updateComment(writeUp, props.comment.id);
                    setIsEdit(false);
                  } else {
                    props.deleteComment(props.comment.id);
                  }
                }}
                className={`text-sm text-gray-60 mr-2 ${
                  isEdit ? "hover:text-green-600" : "hover:text-red-600"
                }`}
              >
                {isEdit ? "Update" : "Delete"}
              </button>
            </>
          ) : (
            ""
          )}
          {!isEdit ? (
            <button
              onClick={() => {
                setIsReply((old) => {
                  return !old;
                });
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Reply
            </button>
          ) : (
            ""
          )}
        </div>
        {/* <!-- Reply Section --> */}
        {props.comment.replies.map((reply, index) => {
          return (
            <Reply
              reply={reply}
              deleteReply={props.deleteReply}
              updateReply={props.updateReply}
              comment_id={props.comment.id}
              key={index}
              input={false}
              timeAgo={timeAgo}
              current={props.current}
            />
          );
        })}
        {isReply ? (
          <Reply
            input={true}
            addReply={props.addReply}
            comment_id={props.comment.id}
            current=""
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
