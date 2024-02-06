import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserData from "../contexts/UserData";
// import Navbar from "../components/Navbar";
import { checkLoginFromNonLogin, CONSTANT } from "../CONSTANT";
import Navbar from "../components/Navbar";
import axios from "axios";
export default function Layout(props) {
  let navigate = useNavigate();
  // ------------------
  // SESSION - END
  // ------------------
  let __init_session = {
    personal: {
      id: "",
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      current_reading_book: "",
      review: "",
      books_completed: "",
      points: "",
      description: "",
      profile_picture: "",
    },
    isLoggedIn: false,
  };
  const [session, setSession] = useState(__init_session);

  useEffect(() => {
    let sessionData = JSON.parse(sessionStorage.getItem("loggedin"));
    if (sessionData) {
      setSession({
        ...__init_session,
        personal: sessionData.data,
        isLoggedIn: true,
      });
    }
  }, []);

  const refreshSession = async () => {
    let sessionData = JSON.parse(sessionStorage.getItem("loggedin"));
    if (sessionData) {
      await axios
        .get(CONSTANT.server + `user/${sessionData.data.id}`)
        .then((response) => {
          sessionStorage.setItem(
            "loggedin",
            JSON.stringify({
              data: response.data,
            })
          );
          setSession({
            ...__init_session,
            personal: response.data,
            isLoggedIn: true,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const value = { session, setSession, refreshSession };
  // ------------------
  // SESSION - END
  // ------------------
  // useEffect(() => {
  //   if (checkLoginFromNonLogin()) {
  //     navigate("/login");
  //   }
  // }, [session]);

  return (
    <>
      <UserData.Provider value={value}>
        <Navbar
          isLoggedIn={session.isLoggedIn}
          __init_session={__init_session}
          setSession={setSession}
          session={session}
        />
        <div className="container mx-auto mt-36">{props.children}</div>
      </UserData.Provider>
    </>
  );
}
