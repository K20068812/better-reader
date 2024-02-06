import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import bg from "/assets/bg2.jpg";
import {
  CONSTANT,
  setMessage,
  resetMessage,
  checkLoginFromLogin,
} from "../CONSTANT";

const Reset = (props) => {
  const navigate = useNavigate();
  const { token: token } = useParams();
  useEffect(() => {
    if (checkLoginFromLogin()) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (token === "") {
      navigate("/");
    }
  }, [token]);

  const reset = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (
      credentials.email !== "" &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(credentials.email)
    ) {
      await axios
        .post(CONSTANT.server + "reset", {
          email: credentials.email,
          client_url: CONSTANT.client,
        })
        .then((response) => {
          if (response.status === 200) {
            let res = response.data;
            if (res.message) {
              setMessage(res.message, "red-500");
            } else {
              setMessage(
                "Email sent to your email address. If you don't see it, please check your spam folder.",
                "green-500"
              );
              setCredentials(__INIT__);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setMessage("Please enter valid email", "red-500");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Reset";
  };

  const save = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (
      credentials.password === credentials.confirm_password &&
      credentials.password.length >= 8 &&
      token !== ""
    ) {
      await axios
        .put(CONSTANT.server + "reset", {
          token: token,
          password: credentials.password,
        })
        .then((response) => {
          if (response.status === 200) {
            let res = response.data;
            if (res.message) {
              setMessage(res.message, "red-500");
            } else {
              setMessage("Password reset successfully!", "green-500");
              setCredentials(__INIT__);
              setTimeout(() => {
                navigate("/login");
              }, 2000);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setMessage(
        "Password should match and be atleast 8 characters",
        "red-500"
      );
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Save";
  };

  const __INIT__ = {
    email: "",
    password: "",
    confirm_password: "",
  };
  const [credentials, setCredentials] = useState(__INIT__);
  const changeCredentials = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <section className="h-screen bg-gray-100 dark:bg-[#1A1A40] relative">
      <img
        src={bg}
        className="absolute w-screen h-screen object-cover blur-sm"
        alt=""
      />
      <div className=" px-6 py-12 h-full ">
        <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
          <div className="w-[28rem] p-6 dark:bg-dimBlue shadow rounded relative z-30 bg-white">
            <h1 className="text-gray-800 text-center text-2xl font-semibold py-5 dark:text-gray-50 items-center flex justify-center">
              <Link to="/" className="mr-3">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  ></path>
                </svg>
              </Link>
              {props.token ? "Set New Password!" : "Reset Password!"}
            </h1>
            <form>
              {!props.token ? (
                <div className="mb-6">
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white dark:bg-dimBlue  dark:text-gray-50 focus:border-blue-600 focus:outline-none"
                    placeholder="Email Address"
                    name="email"
                    value={credentials.email}
                    onChange={changeCredentials}
                  />
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  dark:bg-dimBlue  dark:text-gray-50 focus:border-blue-600 focus:outline-none"
                      placeholder="Password"
                      name="password"
                      value={credentials.password}
                      onChange={changeCredentials}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  dark:bg-dimBlue  dark:text-gray-50 focus:border-blue-600 focus:outline-none"
                      placeholder="Confirm Password"
                      name="confirm_password"
                      value={credentials.confirm_password}
                      onChange={changeCredentials}
                    />
                  </div>
                </>
              )}

              <button
                onClick={props.token ? save : reset}
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-3 uppercase text-center mb-2 w-full"
              >
                {props.token ? "Save" : "Reset"}
              </button>
              <div
                className="my-5 text-center"
                id="error"
                style={{ display: "none" }}
              ></div>
              <div className="flex space-x-1 items-center justify-center my-6">
                <div className="form-group form-check ">
                  <p className="text-sm  dark:text-gray-50">Back to</p>
                </div>
                <Link
                  to="/login"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out"
                >
                  Log In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reset;
