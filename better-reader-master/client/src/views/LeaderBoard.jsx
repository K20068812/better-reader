import UserData from "../contexts/UserData";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import trophy from "/assets/trophy.png";
import axios from "axios";
import avatar from "/assets/avatar.png";
import UserLeaderCard from "../components/UserLeaderCard";
import { CONSTANT } from "../CONSTANT";
import ordinal from "ordinal";
const Leaderboard = () => {
  let navigate = useNavigate();
  const { session, setSession, refreshSession } = useContext(UserData);
  const [top10Users, setTop10Users] = useState([]);
  const [trophies, setTrophies] = useState([]);

  const fetchTrophies = async () => {
    await axios
      .get(CONSTANT.server + `usertrophies/${session?.personal?.id}`)
      .then((response) => {
        setTrophies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchTopUsers = async () => {
    await axios
      .post(CONSTANT.server + `usertrophies`, {})
      .then((response) => {
        setTop10Users(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (session.isLoggedIn) {
      fetchTrophies();
      fetchTopUsers();
    }
  }, [session]);

  const getLevel = (points) => {
    return parseInt(points / 250);
  };

  const mapRange = (value, fromLow, fromHigh, toLow, toHigh) => {
    return (
      ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow
    );
  };

  return (
    <div className="flex flex-row my-5">
      {/* Left section */}
      <div className="flex flex-col w-1/3 bg-gray-100 px-4 py-6">
        {/* User info section */}
        <div className="flex flex-col items-center h-1/4">
          {/* User avatar */}
          <img
            src={
              session?.personal?.profile_picture &&
              session?.personal?.profile_picture !== ""
                ? session?.personal?.profile_picture
                : avatar
            }
            alt="User avatar"
            className="rounded-full w-24 h-24 mb-2"
          />
          {/* User info */}
          <div className="text-center">
            <p className="font-bold text-lg">{session?.personal?.username}</p>
            <p>Level: {getLevel(session?.personal?.points)}</p>
          </div>
          {/* Progress bar */}
          <div className="mt-4 w-96">
            <div className="h-4 bg-gray-300 rounded-full">
              <div
                className={`h-full bg-blue-600 rounded-full`}
                style={{
                  width: `${mapRange(
                    parseInt(session?.personal?.points % 250),
                    0,
                    250,
                    0,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        {/* Card list section */}
        <div className="flex flex-col mt-8 h-3/4">
          {top10Users.map((user, index) => {
            return (
              <UserLeaderCard
                data={user}
                key={index}
                position={ordinal(index + 1)}
                avatar={user?.profile_picture &&
                  user?.profile_picture !== ""
                    ? user?.profile_picture
                    : avatar}
                mapRange={mapRange}
                getLevel={getLevel}
              />
            );
          })}
        </div>
      </div>
      {/* Right section */}
      <div className="flex-1 bg-gray-20 px-4 py-6">
        {/* Trophies section */}

        <span className="mb-5 block">
          <p className="text-4xl text-center subpixel-antialiased font-bold">
            Achievements
          </p>
        </span>
        <div className="flex flex-wrap justify-center gap-5">
          {/* Trophy item */}

          {trophies.map((elm, index) => {
            return (
              <div
                className="transition-all ease-in-out duration-300 cursor-pointer relative w-[30%] h-48 p-4 flex flex-col space-y-4 items-center justify-center group"
                key={index}
              >
                {/* Trophy image */}
                <img
                  src={trophy}
                  alt={elm.code}
                  className={`w-20 object-cover rounded-lg ${
                    !elm.has_trophy ? "grayscale" : ""
                  }`}
                />
                {/* Progress bar */}
                <div className="group-hover:hidden bottom-0 w-44 mx-auto left-1/2  h-3 bg-gray-300 rounded-full">
                  <div
                    className={`h-full ${
                      elm.has_trophy ? "bg-emerald-800" : "bg-blue-600"
                    } rounded-full`}
                    style={{
                      width: `${elm.percentage > 100 ? 100 : elm.percentage}%`,
                    }}
                  ></div>
                </div>
                {/* Tooltip */}
                <div
                  className={`${
                    elm.has_trophy ? "bg-emerald-800" : "bg-gray-700"
                  } items-center flex justify-center transition-all text-center ease-in-out duration-300 w-full h-full  bg-opacity-75 group-hover:flex hidden`}
                >
                  <p
                    className={`${
                      elm.has_trophy ? "text-white" : "text-white"
                    } font-normal m-0 p-2`}
                  >
                    {elm.criteria}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Leaderboard;
