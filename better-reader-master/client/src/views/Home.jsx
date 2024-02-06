import React, { useState } from "react";
import bg1 from "/assets/book-cover/book1.jpg";
import bg2 from "/assets/book-cover/book2.jpg";
import bg3 from "/assets/book-cover/book3.jpg";
import { useNavigate } from "react-router-dom";
import { CONSTANT , getBookThumbnail} from "../CONSTANT";
import parse from "html-react-parser";
import axios from "axios";
const Home = () => {
  
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);

  const searchBooks = async () => {
    if (search !== "") {
      await axios
        .post(CONSTANT.server + "search_books", {
          search_query: search,
        })
        .then((response) => {
          setBooks(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="">
      <h1 className="text-center font-bold text-gray-700 text-6xl">
        Better Reader
      </h1>
      {/* Search Book  */}
      <div className=" text-gray-600 border-gray-300 bg-white w-4/6 mx-auto my-20 rounded-lg border-2 overflow-hidden flex items-center justify-between">
        <input
          className="w-full h-14 px-5 pr-10 focus:outline-none overflow-hidden text-xl"
          name="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value !== "") {
              searchBooks();
            }
          }}
          placeholder="Browse for your next great read..."
        />
        <button
          onClick={searchBooks}
          className=" mr-4 flex items-center justify-center"
        >
          <svg
            className="text-gray-600 h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M23.707 22.293l-6.271-6.271c1.15-1.48 1.837-3.318 1.837-5.322 0-5.238-4.262-9.5-9.5-9.5S0 5.513 0 10.75s4.262 9.5 9.5 9.5c1.941 0 3.732-.586 5.244-1.578l6.285 6.285a1 1 0 101.414-1.414zM9.5 17c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5 6.5 2.916 6.5 6.5-2.916 6.5-6.5 6.5z" />
          </svg>
        </button>
      </div>

      <div className="my-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {books.map((book, index) => {
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden pt-5 cursor-pointer hover:shadow-xl transition ease-in-out"
                onClick={() => navigate(`book-detail/${book?.id}`)}
              >
                <div className="h-80">
                  <img
                    className="w-full  h-full object-contain rounded-lg"
                    src={getBookThumbnail(book?.imageLinks)}
                    alt={book?.title}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-medium text-gray-900">
                    {book?.title}
                  </h3>
                  <p className="mt-2 text-gray-600 line-clamp-5">{parse(book?.description)}</p>
                </div>
              </div>
            );
          })}
          {books.length <= 0
            ? [1, 2, 3, 4].map((a, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg overflow-hidden pt-5 cursor-pointer hover:shadow-xl transition ease-in-out"
                  >
                    <div className="h-50">
                      <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                        <svg
                          className="w-12 h-12 text-gray-200 dark:text-gray-600"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 640 512"
                        >
                          <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Home;
