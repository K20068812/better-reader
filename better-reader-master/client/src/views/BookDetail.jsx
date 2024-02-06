import axios from "axios";
import UserData from "../contexts/UserData";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import book from "/assets/book-cover/book1.jpg";
import ReviewSnap from "../components/ReviewSnap";
import { CONSTANT, getBookThumbnail } from "../CONSTANT";
import Comment from "../components/Comment";
import CreateableSelect from "../components/CreateableSelect";
import parse from "html-react-parser";

const RATING = Math.floor(Math.random() * 5) + 1;

const BookDetail = (props) => {
  const { session, setSession, refreshSession } = useContext(UserData);
  const { book_id: book_id } = useParams();
  let navigate = useNavigate();

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
  const searchBook = async () => {
    if (book_id !== "") {
      await axios
        .get(
          CONSTANT.server +
            `search_books/${book_id.toString()}?user=${session?.personal?.id}`
        )
        .then((response) => {
          setBook(response.data);
          viewComments(response.data.id);
          if (response?.data?.shelf !== "") {
            setShelf({
              value: response?.data?.shelf?.shelf?.id,
              label: response?.data?.shelf?.shelf?.title,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (session.isLoggedIn) {
      searchBook();
      viewShelfs();
    }
  }, [session]);

  const updateReading = async (book_id = "") => {
    await axios
      .put(CONSTANT.server + `user/${session.personal?.id}`, {
        ...session.personal,
        current_reading_book: book_id,
      })
      .then((response) => {
        refreshSession();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [writeUp, setWriteUp] = useState("");
  const [comments, setComments] = useState([]);

  const addComment = async () => {
    if (writeUp !== "") {
      await axios
        .post(CONSTANT.server + `comment`, {
          book: book.id,
          by_user: session.personal.id,
          content: writeUp,
        })
        .then((response) => {
          viewComments();
          setWriteUp("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const updateComment = async (content, comment_id) => {
    if (content !== "") {
      await axios
        .put(CONSTANT.server + `comment/${comment_id}`, {
          book: book.id,
          by_user: session.personal.id,
          content: content,
        })
        .then((response) => {
          viewComments();
          setWriteUp("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteComment = async (comment_id = null) => {
    await axios
      .delete(CONSTANT.server + `comment/${comment_id}`)
      .then((response) => {
        viewComments();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const viewComments = async (book_id = book.id) => {
    await axios
      .get(CONSTANT.server + `comment/${book_id}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addReply = async (comment_id, content) => {
    if (content !== "") {
      await axios
        .post(CONSTANT.server + `reply`, {
          comment: comment_id,
          by_user: session.personal.id,
          content: content,
        })
        .then((response) => {
          viewComments();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const updateReply = async (comment_id, content, reply_id) => {
    if (content !== "") {
      await axios
        .put(CONSTANT.server + `reply/${reply_id}`, {
          comment: comment_id,
          by_user: session.personal.id,
          content: content,
        })
        .then((response) => {
          viewComments();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteReply = async (reply_id) => {
    await axios
      .delete(CONSTANT.server + `reply/${reply_id}`)
      .then((response) => {
        viewComments();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getRating = () => {
    // Generate a random number between 0 and 5, inclusive of 0 but not of 5
    return (
      <div className="flex items-center space-x-1">
        {[...Array(RATING).keys()].map((a, b) => {
          return (
            <svg
              aria-hidden="true"
              class="text-yellow-400 w-7 h-7"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>{b + 1} star</title>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          );
        })}
        {[...Array(5 - RATING).keys()].map((a, b) => {
          return (
            <svg
              aria-hidden="true"
              class="text-gray-300 w-7 h-7 dark:text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>{b + 1} star</title>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          );
        })}
      </div>
    );
  };

  const [addShelf, setAddShelf] = useState(false);
  const [shelf, setShelf] = useState(null);
  const [shelfs, setShelfs] = useState([]);

  const viewShelfs = async (update = null) => {
    await axios
      .get(CONSTANT.server + `shelf/${session?.personal?.id}`)
      .then((response) => {
        setShelfs(response.data);
        if (update) {
          setShelf({
            value: response?.data?.filter((a, b) => {
              return a.title === update;
            })[0]?.id,
            label: update,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createShelf = async (shelf) => {
    await axios
      .post(CONSTANT.server + `shelf`, {
        title: shelf,
        user: session?.personal?.id,
      })
      .then((response) => {
        viewShelfs(shelf);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addBookToShelf = async () => {
    await axios
      .post(CONSTANT.server + `userbooks`, {
        book: book_id,
        user: session?.personal?.id,
        shelf: shelf?.value,
      })
      .then((response) => {
        setBook({
          ...book,
          shelf: response.data,
        });
        setAddShelf(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {/* Hero Section  */}
      <div className="flex items-start space-x-10 ">
        <div className="w-[25%]  overflow-hidden cursor-pointer hover:shadow-xl  transition ease-in-out  flex items-start">
          <img
            className="w-full h-full  object-contain"
            src={getBookThumbnail(book.volumeInfo?.imageLinks)}
            alt={book.volumeInfo?.title}
          />
        </div>

        <div className="text-gray-800 space-y-3  w-[50%]">
          <div className="mb-20 ">
            <h1 className="text-3xl font-semibold mb-2">
              {book.volumeInfo?.title}
            </h1>
            <h1 className="text-lg w-2/3">
              {parse(book?.volumeInfo?.description ?? "")}
            </h1>
            <div className="flex items-center space-x-3 mt-8">
              <h1 className="text-lg font-medium">Author:</h1>
              <h1 className="text-lg">
                {book?.volumeInfo?.authors?.join(", ") ?? "Anonymous"}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-medium">Number of Pages:</h1>
              <h1 className="text-lg">{book.volumeInfo?.pageCount}</h1>
            </div>
          </div>
        </div>
        <div className="text-gray-800 w-[25%] ">
          <div className="flex items-center gap-3 flex-col">
            <h1 className="text-xl font-semibold ">
              Rating{/* {book?.volumeInfo?.maturityRating} */}
            </h1>
            {getRating()}
          </div>

          <div className="flex flex-col mt-10">
            <button
              onClick={() => {
                session.isLoggedIn
                  ? session.personal?.current_reading_book !== ""
                    ? session?.personal?.current_reading_book === book.id
                      ? updateReading()
                      : updateReading(book.id)
                    : updateReading(book.id)
                  : navigate("/");
              }}
              className={`text-white ${
                session?.personal?.current_reading_book === book.id
                  ? "bg-red-700 hover:bg-red-800"
                  : session.personal?.current_reading_book !== ""
                  ? "bg-yellow-700 hover:bg-yellow-800"
                  : ""
              } bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4  mb-2 w-full`}
            >
              {session.isLoggedIn
                ? session.personal?.current_reading_book !== null &&
                  session.personal?.current_reading_book !== ""
                  ? session?.personal?.current_reading_book === book.id
                    ? "Remove Currently Reading"
                    : "Replace Currently Reading"
                  : "Add to Currently Reading"
                : "Login to Track"}
            </button>
            <div className="flex flex-row space-x-2 mt-1">
              <button
                onClick={() => {
                  if (!addShelf) {
                    setAddShelf(true);
                  } else {
                    addBookToShelf();
                  }
                }}
                className={`${
                  !shelf && addShelf ? "pointer-events-none opacity-40" : ""
                } focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-4  mb-2 w-full`}
              >
                {addShelf
                  ? "Update"
                  : shelf && shelf?.value !== ""
                  ? "Change Shelf"
                  : "Add to Shelf"}
              </button>
              {addShelf && (
                <button
                  onClick={() => {
                    setAddShelf(false);
                  }}
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-4  mb-2 w-full"
                >
                  Cancel
                </button>
              )}
            </div>
            {!addShelf && shelf && !!book?.shelf?.shelf?.title && (
              <span className="mt-3 text-gray-500 text-center">
                Current Shelf : {book?.shelf?.shelf?.title}
              </span>
            )}
            {addShelf && (
              <>
                <CreateableSelect
                  isClearable
                  className="w-full mt-2"
                  defaultValue={shelf}
                  setShelf={setShelf}
                  options={shelfs}
                  onCreateOption={createShelf}
                  name="shelf"
                />
                <span className="mt-3 text-gray-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                  To add new shelf, write and hit enter.
                </span>
              </>
            )}
          </div>

          {/* <div className="space-y-3 mt-5">
            {[1, 2, 3, 4].map((elm, index) => {
              return <ReviewSnap key={index} />;
            })}
          </div> */}
        </div>
      </div>

      {/* Comment Section */}

      <div className="">
        <div className="w-full  shadow rounded p-5 my-20">
          <textarea
            placeholder="Comment here..."
            className="w-full h-40  p-4 outline-none"
            style={{
              resize: "none",
            }}
            value={writeUp}
            onChange={(e) => {
              setWriteUp(e.target.value);
            }}
          />

          <div className="flex justify-end w-full">
            <button
              onClick={addComment}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-16  py-4  mt-5  "
            >
              Post
            </button>
          </div>
        </div>

        <div className="mt-8 w-full">
          <h2 className="text-xl font-medium mb-4">Comments</h2>
          <div className="space-y-8 mb-20 w-full">
            {/* <!-- Comment 1 --> */}
            {comments.map((comment, index) => {
              return (
                <Comment
                  comment={comment}
                  key={index}
                  deleteComment={deleteComment}
                  updateComment={updateComment}
                  addReply={addReply}
                  updateReply={updateReply}
                  deleteReply={deleteReply}
                  current={session.personal.id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
