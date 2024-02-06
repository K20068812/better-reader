import axios from "axios";
import UserData from "../contexts/UserData";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import bookIcon from "/assets/icons/book.svg";
import bookShelf from "/assets/icons/bookshelf.svg";
import Chart from "../components/Chart";
import { CONSTANT, ICONS, getBookThumbnail } from "../CONSTANT";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import parse from "html-react-parser";

const BookReport = () => {
  const { width, height } = useWindowSize();
  let navigate = useNavigate();
  const { session, setSession, refreshSession } = useContext(UserData);
  const [isBookShelf, setIsBookShelf] = useState(false);

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
    if (session?.personal?.current_reading_book !== "") {
      await axios
        .get(
          CONSTANT.server +
            `search_books/${session?.personal?.current_reading_book}?user=${session?.personal?.id}`
        )
        .then((response) => {
          setBook(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    if (session.isLoggedIn) {
      searchBook();
      viewShelfs();
      fetchLast7DaysRecord();
    }
  }, [session]);
  const [shelfs, setShelfs] = useState([]);

  const viewShelfs = async () => {
    await axios
      .get(CONSTANT.server + `shelf/${session?.personal?.id}`)
      .then((response) => {
        setShelfs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [shelf, setShelf] = useState("");
  const [booksInShelf, setBooksInShelf] = useState([]);

  const fetchBooksInShelf = async (shelf) => {
    await axios
      .get(CONSTANT.server + `userbooks/${shelf}?user=${session?.personal?.id}`)
      .then((response) => {
        setBooksInShelf(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (shelf !== "") {
      fetchBooksInShelf(shelf);
    }
  }, [shelf]);

  const deleteShelf = async (shelf_id) => {
    await axios
      .delete(CONSTANT.server + `shelf/${shelf_id}`)
      .then((response) => {
        viewShelfs();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeBookFromShelf = async (id) => {
    await axios
      .delete(CONSTANT.server + `userbooks/${id}`)
      .then((response) => {
        fetchBooksInShelf(shelf);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [readRecord, setReadRecord] = useState({
    readToday: 0,
    records: [],
  });

  
  function getPagesReadToday(userProgressArray = readRecord.records) {
    // Get today's date in ISO 8601 format
    const today = new Date().toISOString().split("T")[0];

    // Loop through the userProgressArray and find the object with today's timestamp
    for (let i = 0; i < userProgressArray.length; i++) {
      const userProgress = userProgressArray[i];
      if (userProgress.timestamp.split("T")[0] === today) {

        setIsProgressToday(true);
        return userProgress.pages_read;
      }
    }

    setIsProgressToday(false);
    // If there is no matching object, return null or an appropriate value
    return null;
  }

  function sumPagesRead(userProgress = readRecord.records) {
    let total = 0;
    userProgress.forEach(function (progress) {
      total += progress.pages_read;
    });
    return total;
  }

  const [isProgressToday, setIsProgressToday] = useState(false);

  const addDailyProgress = async () => {
    await axios
      .post(CONSTANT.server + `userprogress`, {
        user: session?.personal?.id,
        book: session?.personal?.current_reading_book,
        pages_read: readRecord?.readToday,
        is_completed:
          sumPagesRead() + parseInt(readRecord?.readToday) ===
          book.volumeInfo?.pageCount,
      })
      .then((response) => {
        if (
          sumPagesRead() + parseInt(readRecord?.readToday) ===
          book.volumeInfo?.pageCount
        ) {
          setConfetti(true);
          setTimeout(() => {
            setConfetti(false);
          }, 10 * 1000);
          // Confetti
          setToast({
            show: true,
            content: `+${readRecord?.readToday} points!\n+100 bonus points!`,
          });
          setTimeout(() => {
            setToast({
              show: false,
              content: ``,
            });
          }, 10 * 1000);
        } else {
          setToast({
            show: true,
            content: `+${readRecord?.readToday} points!`,
          });
          setTimeout(() => {
            setToast({
              show: false,
              content: ``,
            });
          }, 5000);
        }
        fetchLast7DaysRecord();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchLast7DaysRecord = async () => {
    await axios
      .get(
        CONSTANT.server +
          `userprogress/${session?.personal?.id}?book=${session?.personal?.current_reading_book}`
      )
      .then((response) => {
        if (response.data?.message) {
        } else {
          setReadRecord({
            ...readRecord,
            records: response.data,
            readToday: getPagesReadToday(response.data) ?? 0,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [toast, setToast] = useState({
    show: false,
    content: "",
  });

  const [confetti, setConfetti] = useState(false);

  return (
    <>
      <div>
        {/* Hero Section  */}
        <div className="flex items-start justify-between w-full space-x-10 ">
          <div className="text-gray-800 w-1/4">
            <div
              className={`flex items-center gap-3 mb-5 cursor-pointer transition-all hover:bg-gray-200 rounded-lg px-5 py-2 ${
                !isBookShelf ? "bg-emerald-300" : ""
              }`}
              onClick={() => setIsBookShelf(false)}
            >
              <div className="w-12">
                <img src={bookIcon} alt="" className="w-full h-full" />
              </div>
              <h1 className="text-xl m-0 p-0">Currently Reading</h1>
            </div>
            <div
              className={`flex items-center gap-3 mb-5 cursor-pointer transition-all hover:bg-gray-200 rounded-lg px-5 py-2 ${
                isBookShelf ? "bg-emerald-300" : ""
              }`}
              onClick={() => setIsBookShelf(true)}
            >
              {" "}
              <div className="w-12">
                <img src={bookShelf} alt="" className="w-full h-full" />
              </div>
              <h1 className="text-xl ">My Bookshelf</h1>
            </div>

            {isBookShelf && (
              <div className="w-full  flex flex-col">
                {shelfs.map((slf, index) => {
                  return (
                    <div
                      onClick={() => {
                        setShelf(slf?.id);
                      }}
                      className={`${
                        slf?.id === shelf
                          ? " text-gray-900 bg-green-100 hover:bg-green-100 focus:ring-0 dark:bg-green-600 dark:hover:bg-green-700 "
                          : " text-gray-900 border-gray-300 hover:bg-gray-100 focus:ring-0 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 "
                      } my-2 flex flex-row items-center justify-between text-left w-full transition-all duration-500  border  focus:outline-none  focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5`}
                    >
                      <span className="cursor-pointer py-1">{slf?.title}</span>
                      <span className="text-right">
                        {!slf.is_global &&
                          slf?.id === shelf &&
                          ICONS.delete(
                            "h-6 w-6 text-red-900 cursor-pointer",
                            () => {
                              deleteShelf(slf?.id);
                            }
                          )}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {!isBookShelf && session?.personal?.current_reading_book !== "" && (
            <>
              {/* ================================= */}
              {/* ================================= */}
              {/* Book Cover Photo */}
              {/* ================================= */}
              {/* ================================= */}

              <div className="overflow-hidden cursor-pointer hover:shadow-xl  transition ease-in-out  flex items-start w-[30%]">
                <Link
                  to={`/book-detail/${book?.id}`}
                  className="block w-full h-full"
                >
                  <img
                    className="w-full h-full  object-contain"
                    src={getBookThumbnail(book.volumeInfo?.imageLinks)}
                    alt={book.volumeInfo?.title}
                  />{" "}
                </Link>
              </div>

              {/* ================================= */}
              {/* ================================= */}
              {/* Book Description , pages read , chart */}
              {/* ================================= */}
              {/* ================================= */}

              <div className="text-gray-800 space-y-3 w-1/4">
                <div className="mb-20 ">
                  <h1 className="text-3xl font-semibold mb-2">
                    {book.volumeInfo?.title}
                  </h1>
                  <h1 className="text-lg w-2/3 line-clamp-5">
                    {parse(book?.volumeInfo?.description ?? "")}
                  </h1>
                  <div className="flex items-center space-x-3 mt-8">
                    <h1 className="text-lg font-medium">Author:</h1>
                    <h1 className="text-lg my-2 mb-3">
                      {book?.volumeInfo?.authors?.join(", ") ?? "Anonymous"}
                    </h1>
                  </div>
                  {book.volumeInfo?.pageCount - sumPagesRead() !== 0 && (
                    <div className="flex items-center space-x-3">
                      <p className="block text-lg font-medium text-gray-900 dark:text-white">
                        Pages read today:
                      </p>
                      <input
                        type="number"
                        className={`${
                          isProgressToday
                            ? "bg-white text-lg text-emerald-800 font-bold"
                            : "bg-gray-50 border border-gray-300 text-sm text-gray-900"
                        }    rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2 w-28`}
                        value={readRecord.readToday}
                        disabled={
                          isProgressToday ||
                          book.volumeInfo?.pageCount - sumPagesRead() === 0
                        }
                        onChange={(e) => {
                          setReadRecord({
                            ...readRecord,
                            readToday:
                              e.target.value < 0
                                ? 0
                                : e.target.value >
                                  book.volumeInfo?.pageCount - sumPagesRead()
                                ? book.volumeInfo?.pageCount - sumPagesRead()
                                : e.target.value,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.target.value) {
                            addDailyProgress();
                          }
                        }}
                      />
                      {!isProgressToday &&
                        book.volumeInfo?.pageCount - sumPagesRead() !== 0 &&
                        ICONS.correct(
                          "h-6 w-6 text-emerald-900 hover:text-emerald-300 transition-all cursor-pointer",
                          () => {
                            addDailyProgress();
                          }
                        )}
                    </div>
                  )}

                  <div className="flex items-center space-x-3 mt-3">
                    <h1 className="text-lg font-medium">Pages read:</h1>
                    <h1 className="text-lg">{sumPagesRead()}</h1>
                  </div>
                  <div className="flex items-center space-x-3 mt-3">
                    <h1 className="text-lg font-medium">Pages left to read:</h1>
                    <h1 className="text-lg">
                      {book.volumeInfo?.pageCount - sumPagesRead()}{" "}
                      {book.volumeInfo?.pageCount - sumPagesRead() === 0 && (
                        <span className="text-emerald-500 text-sm">
                          (Completed)
                        </span>
                      )}
                    </h1>
                  </div>
                  <div className="flex items-center space-x-3 mt-3">
                    <h1 className="text-lg font-medium">Total pages:</h1>
                    <h1 className="text-lg">{book.volumeInfo?.pageCount}</h1>
                  </div>

                  <div className="mt-10">
                    <Chart records={readRecord.records} />
                  </div>
                </div>
              </div>
            </>
          )}
          {isBookShelf && (
            <>
              <div className=" h-[80vh] overflow-y-scroll space-y-5 scrollbar-hide">
                {booksInShelf.map((elm, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-[60rem] bg-gray-50 rounded-md shadow-lg overflow-hidden h-96 p-5 relative"
                    >
                      {/* <!-- Left column for book cover image --> */}
                      <div className="w-56  flex items-start justify-start p-3">
                        <img
                          src={getBookThumbnail(
                            elm?.book.volumeInfo?.imageLinks
                          )}
                          alt={elm?.book.volumeInfo?.title}
                          className=" h-full object-contain cursor-pointer"
                          onClick={() => {
                            navigate(`/book-detail/${elm?.book?.id}`);
                          }}
                        />
                      </div>

                      {/* <!-- Right column for book information --> */}
                      <div className=" p-6 w-2/3 ">
                        <h2
                          className="text-xl font-semibold mb-2 cursor-pointer"
                          onClick={() => {
                            navigate(`/book-detail/${elm?.book?.id}`);
                          }}
                        >
                          {elm?.book.volumeInfo?.title}
                        </h2>
                        <p className="text-gray-700 text-base mb-4 line-clamp-6">
                          {parse(elm?.book?.volumeInfo?.description ?? "")}
                        </p>
                        <p className="text-gray-700 text-base">
                          Author:{" "}
                          {elm?.book?.volumeInfo?.authors?.join(", ") ?? "Anonymous"}
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-10 h-10 text-red-500 hover:text-red-700 transition ease-in-out cursor-pointer  absolute bottom-5 right-5"
                          onClick={() => {
                            removeBookFromShelf(elm?.id);
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
                {booksInShelf.length <= 0 && shelf !== "" && (
                  <div
                    className="w-[60rem] text-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
                    role="alert"
                  >
                    <span className="font-medium">There aren't any books added yet!</span> Venture out and discover some books to include...
                  </div>
                )}
                {shelf === "" && (
                  <div
                    className="w-[60rem] text-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
                    role="alert"
                  >
                    <span className="font-medium">Select any shelf!</span>
                  </div>
                )}
              </div>
            </>
          )}
          {!isBookShelf && session?.personal?.current_reading_book === "" && (
            <div
              className="w-[60rem] text-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
              role="alert"
            >
              <span className="font-medium">Currently, you're not reading any book.</span>
            </div>
          )}
        </div>

        {/* Comment Section */}
      </div>
      <div
        className={`${
          toast.show
            ? "opacity-100 right-[3rem]"
            : "opacity-0 pointer-events-none right-[20rem]"
        } absolute transition-all ease-in-out duration-200 bottom-4  flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800`}
      >
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ml-3 text-lg text-emerald-500">
          {toast.content.split("\n").map((a, b) => {
            return <div>{a}</div>;
          })}
        </div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          data-dismiss-target="#toast-success"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {confetti && <Confetti width={width} height={height} />}
    </>
  );
};

export default BookReport;
