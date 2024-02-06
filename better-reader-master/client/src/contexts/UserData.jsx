import React from "react";

const UserData = React.createContext({
  session: {
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
  },
  setSession: () => {},
  refreshSession: () => {},
});

export default UserData;
