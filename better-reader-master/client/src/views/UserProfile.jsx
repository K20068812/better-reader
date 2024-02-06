import React, { useState, useContext, useEffect } from "react";
import trophy from "/assets/trophy.png";
import avatar from "/assets/avatar2.png";
import { useParams, useNavigate } from "react-router-dom";
import UserLeaderCard from "../components/UserLeaderCard";
import bookCover from "/assets/book-cover/book3.jpg";
import UserData from "../contexts/UserData";
import axios from "axios";
import { CONSTANT, ICONS, getBookThumbnail } from "../CONSTANT";
const UserProfile = () => {
  const { session, setSession, refreshSession } = useContext(UserData);
  const { user_id: user_id } = useParams();
  let navigate = useNavigate();
  const [isUserProfile, setIsUserProfile] = useState(false);
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [isEditReview, setIsEditReview] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user_id) {
      fetchUser(user_id);
      fetchTrophies(user_id);
    } else {
      navigate("/");
    }
  }, [user_id]);

  const fetchUser = async (user_id = null) => {
    await axios
      .get(CONSTANT.server + `user/${user_id}`)
      .then((response) => {
        if (response.data?.message) {
          navigate("/");
        } else {
          setUser(response.data);
          searchBook(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [trophies, setTrophies] = useState([]);

  const fetchTrophies = async (user_id) => {
    await axios
      .get(CONSTANT.server + `usertrophies/${user_id}`)
      .then((response) => {
        setTrophies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getLevel = (points) => {
    return parseInt(points / 250);
  };
  const searchBook = async (user) => {
    if (user.current_reading_book !== "") {
      await axios
        .get(
          CONSTANT.server +
            `search_books/${user.current_reading_book}?user=${user.id}`
        )
        .then((response) => {
          setBook(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const [book, setBook] = useState({
    id: "",
    volumeInfo: {
      title: "",
      subtitle: "",
      authors: [],
      publisher: "",
      publishedDate: "",
      description: "",
      pageCount: 0,
      printedPageCount: 0,
      printType: "",
      maturityRating: "",
      imageLinks: {
        smallThumbnail: "",
        thumbnail: "",
        small: "",
        medium: "",
        large: "",
        extraLarge: "",
      },
    },
  });

  const update_info = async (type, user_id, payload) => {
    await axios
      .put(CONSTANT.server + `update_info`, {
        type: type,
        user_id: user_id,
        payload: payload,
      })
      .then((response) => {
        if (
          type === "description" ||
          type === "review" ||
          type === "settings"
        ) {
          refreshSession();
          fetchUser(user.id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [payload, setPayload] = useState({
    type: "",
    payload: "",
  });

  return (
    <div className="flex flex-row ">
      {/* ===================== */}
      {/* Modal for Update Profile */}
      {/* ===================== */}

      {isEditProfile && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 relative z-50">
            <h2 className="text-xl font-medium mb-4">Update Profile</h2>
            <div>
              <div className="mb-4">
                <label for="password" className="block font-medium mb-2">
                  Change Password
                </label>
                <input
                  type="password"
                  value={payload.payload?.password}
                  onChange={(e) => {
                    setPayload({
                      ...payload,
                      payload: {
                        ...payload.payload,
                        password: e.target.value,
                      },
                    });
                  }}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label for="profile-picture" className="block font-medium mb-2">
                  Change Profile Picture
                </label>
                <input
                  type="file"
                  // value={payload.payload?.profile_picture}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = () => {
                      setPayload({
                        ...payload,
                        payload: {
                          ...payload.payload,
                          profile_picture: reader.result,
                        },
                      });
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => {
                  update_info(payload.type, user?.id, payload.payload);
                  setIsEditProfile(false);
                }}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setIsEditProfile(false);
                  setPayload({
                    type: "",
                    payload: "",
                  });
                }}
                className="bg-red-500 ml-2 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Left section */}
      <div className="flex flex-col w-1/3 bg-gray-100 px-4 py-6 h-[80vh] relative">
        {user?.id === session?.personal?.id && (
          <button
            className="absolute top-5 right-5"
            onClick={() => {
              setIsEditProfile(true);
              setPayload({
                type: "settings",
                payload: {
                  password: "",
                  profile_picture: "",
                },
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        )}
        {/* User info section */}
        <div className="flex flex-col items-center ">
          {/* User avatar */}
          <img
            src={
              user?.profile_picture && user?.profile_picture !== ""
                ? user?.profile_picture
                : avatar
            }
            alt="User avatar"
            className="rounded-full w-44 h-44 mb-2"
          />
          {/* User info */}
          <div className="text-center">
            <p className="font-bold text-2xl">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xl">Level {getLevel(user?.points)}</p>
          </div>
        </div>
        <div className="mt-6 text-gray-800 text-center">
          <div className="flex items-center justify-center">
            <div
              className={`bg-yellow-500 rounded-full w-9 h-9 flex items-center justify-center text-white mr-2 text-lg`}
            >
              {trophies.filter((a, b) => {
                return a.has_trophy;
              }).length ?? 0}
            </div>
            <p className="text-lg font-medium">Achievements collected</p>
          </div>
        </div>
        <div className="mt-6 text-gray-800 text-center">
          <div className="flex items-center mb-4 justify-center space-x-4">
            <p className="text-xl  border-b-4 border-yellow-500 inline-block">
              Description
            </p>
            {user?.id === session?.personal?.id &&
              (!isEditDescription ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    setIsEditDescription(true);
                    setPayload({
                      type: "description",
                      payload: user.description,
                    });
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              ) : (
                <>
                  {ICONS.correct(
                    "h-6 w-6 text-green-900 cursor-pointer",
                    () => {
                      update_info(payload.type, user.id, payload.payload);
                      setIsEditDescription(false);
                    }
                  )}
                  {ICONS.discard("h-6 w-6 text-red-900 cursor-pointer", () =>
                    setIsEditDescription(false)
                  )}
                </>
              ))}
          </div>
          {isEditDescription ? (
            <textarea
              id="text"
              name="text"
              placeholder="Write description here..."
              rows="8"
              value={payload.payload}
              onChange={(e) => {
                setPayload({
                  ...payload,
                  payload: e.target.value,
                });
              }}
              className="w-full px-5 py-3 bg-gray-200 border-gray-800 rounded-md shadow-sm focus:outline-none"
            ></textarea>
          ) : (
            <div className="mt-6 flex items-center justify-center px-8">
              {user?.description === ""
                ? "No description available."
                : user?.description}
            </div>
          )}
        </div>
      </div>
      {/* Right section */}

      {user?.current_reading_book !== "" ? (
        <div className="w-[30rem] max-w-3xl mx-auto">
          <div className="relative h-[55vh]  p-2/3">
            <img
              className="absolute h-full w-full object-contain rounded-lg shadow-md"
              src={getBookThumbnail(book.volumeInfo?.imageLinks)}
              alt={book.volumeInfo?.title}
            />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {book.volumeInfo?.title}
            </h2>
            <p className="mt-2 text-gray-700 text-lg">
              Author Name: {book.volumeInfo?.authors.join(", ")}
            </p>
            <div className="flex items-center mb-4 justify-start space-x-4">
              <p className="mt-2  text-lg text-gray-500">
                Current thoughts on the book:
              </p>
              {user?.id === session?.personal?.id &&
                (!isEditReview ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                      setIsEditReview(true);
                      setPayload({
                        type: "review",
                        payload: user.review,
                      });
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                ) : (
                  <>
                    {ICONS.correct(
                      "h-6 w-6 text-green-900 cursor-pointer",
                      () => {
                        update_info(payload.type, user.id, payload.payload);
                        setIsEditReview(false);
                      }
                    )}
                    {ICONS.discard("h-6 w-6 text-red-900 cursor-pointer", () =>
                      setIsEditReview(false)
                    )}
                  </>
                ))}
            </div>
            {isEditReview ? (
              <textarea
                id="text"
                name="text"
                placeholder="Write review here..."
                value={payload.payload}
                onChange={(e) => {
                  setPayload({
                    ...payload,
                    payload: e.target.value,
                  });
                }}
                className="w-full px-5 py-3 bg-gray-200 border-gray-800 rounded-md shadow-sm focus:outline-none"
              ></textarea>
            ) : (
              <div className="mt-6 flex items-center justify-center px-8">
                {user?.review === "" ? "No review available." : user?.review}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="mx-auto px-[10rem] h-fit text-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
          role="alert"
        >
          <span className="font-medium">No book reading yet...</span>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
