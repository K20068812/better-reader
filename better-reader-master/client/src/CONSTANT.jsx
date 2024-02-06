import axios from "axios";

// export const CONSTANT = {
//   server: "http://127.0.0.1:8000/api/", 
//   admin: "http://127.0.0.1:8000/admin", 
//   client: "http://localhost:5173/", 
// };

export const CONSTANT = {
  server: "https://betterreader.pythonanywhere.com/api/", 
  admin: "http://betterreader.pythonanywhere.com/admin/", 
  client: "http://betterreader.pythonanywhere.com/", 
};

export const ICONS = {
  search: (
    <svg
      aria-hidden="true"
      className="w-5 h-5 text-gray-500 dark:text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  ),
  delete: (className, callback) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onClick={callback}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20 6h-3.155a.949.949 0 0 0-.064-.125l-1.7-2.124A1.989 1.989 0 0 0 13.519 3h-3.038a1.987 1.987 0 0 0-1.562.75l-1.7 2.125A.949.949 0 0 0 7.155 6H4a1 1 0 0 0 0 2h1v11a2 2 0 0 0 1.994 2h10.011A2 2 0 0 0 19 19V8h1a1 1 0 0 0 0-2zm-9.519-1h3.038l.8 1H9.681zm6.524 14H7V8h10z" />
        <path d="M14 18a1 1 0 0 1-1-1v-7a1 1 0 0 1 2 0v7a1 1 0 0 1-1 1zM10 18a1 1 0 0 1-1-1v-7a1 1 0 0 1 2 0v7a1 1 0 0 1-1 1z" />
      </svg>
    );
  },
  update: (className, callback) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onClick={callback}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.269 5.614l-1.883-1.883a2.5 2.5 0 0 0-3.531 0l-9.562 9.562a1 1 0 0 0-.242.391l-2 6a1 1 0 0 0 1.265 1.265l6-2a1 1 0 0 0 .391-.242l9.562-9.562a2.5 2.5 0 0 0 0-3.531zM7.414 14L14 7.414 16.586 10 10 16.586zm-.977 1.851l1.712 1.712-2.568.856zm12.417-8.12L18 8.586 15.414 6l.854-.854a.5.5 0 0 1 .7 0l1.883 1.883a.5.5 0 0 1 .003.702z" />
      </svg>
    );
  },
  discard: (className, callback) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onClick={callback}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.414 12l4.95-4.95a1 1 0 0 0-1.414-1.414L12 10.586l-4.95-4.95A1 1 0 0 0 5.636 7.05l4.95 4.95-4.95 4.95a1 1 0 0 0 1.414 1.414l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414-1.414z" />
      </svg>
    );
  },
  correct: (className, callback) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="currentColor"
        onClick={callback}
        viewBox="0 0 24 24"
      >
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M9.172 18.657a1 1 0 0 1-.707-.293l-5.657-5.657a1 1 0 0 1 1.414-1.414l4.95 4.95L19.778 5.636a1 1 0 0 1 1.414 1.414L9.879 18.364a1 1 0 0 1-.707.293z"
        />
      </svg>
    );
  },
  add: (className, callback) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="currentColor"
        onClick={callback}
        viewBox="0 0 24 24"
      >
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M20.207 18.793L16.6 15.184a7.027 7.027 0 1 0-1.416 1.416l3.609 3.609a1 1 0 0 0 1.414-1.416zM6 11a5 5 0 1 1 5 5 5.006 5.006 0 0 1-5-5z"
        />
      </svg>
    );
  },
};

export const checkLoginFromLogin = () => {
  return sessionStorage.getItem("loggedin") &&
    JSON.parse(sessionStorage.getItem("loggedin")).data
    ? true
    : false;
};

export const checkLoginFromNonLogin = () => {
  return sessionStorage.getItem("loggedin") &&
    JSON.parse(sessionStorage.getItem("loggedin")).data
    ? false
    : true;
};

const imageSizes = [
  // "extraLarge",
  // "large",
  // "medium",
  "thumbnail",
  "small",
  "smallThumbnail",
];
export const getBookThumbnail = (imageLinks) => {
  for (const size of imageSizes) {
    if (imageLinks[size]) {
      return imageLinks[size];
    }
  }
  return "https://cdn.bookauthority.org/dist/images/book-cover-not-available.6b5a104fa66be4eec4fd16aebd34fe04.png"; // Return empty string if none of the image sizes exist
};

export const getUserData = () => {
  if (
    sessionStorage.getItem("loggedin") &&
    JSON.parse(sessionStorage.getItem("loggedin")).data
  ) {
    // request data
    axios
      .get(
        CONSTANT.server +
          `user/${JSON.parse(sessionStorage.getItem("loggedin")).data.id}`
      )
      .then((response) => {
        let res = response.data;
        sessionStorage.setItem(
          "loggedin",
          JSON.stringify({
            data: res,
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    JSON.parse(sessionStorage.getItem("loggedin")).data ?? {
      id: "",
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      current_reading_book: "",
      review: "",
    }
  );
};

export const Loader = (extra = "") => {
  return (
    <div className={`spinner-grow ${extra}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export const setMessage = (text, color) => {
  let error = document.getElementById("error");
  error.innerHTML = text;
  error.classList.add("text-" + color);
  error.style.display = "block";
};

export const resetMessage = () => {
  let error = document.getElementById("error");
  error.innerText = "";
  error.style.display = "none";
  error.classList.remove("text-red-500");
  error.classList.remove("text-green-500");
};

export const isMessage = () => {
  let error = document.getElementById("error");
  if (error.style.display === "none") {
    return false;
  }
  return true;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Set a Cookie
export function setCookie(cName, cValue, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

export function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split("; ");
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}
