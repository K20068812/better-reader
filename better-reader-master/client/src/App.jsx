import React, { useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./auth/Login";
import Layout from "./layout/Layout";
import "./index.css";
import Register from "./auth/Register";
import Reset from "./auth/Reset";
import Home from "./views/Home";
import BookDetail from "./views/BookDetail";
import BookReport from "./views/BookReport";
import Leaderboard from "./views/LeaderBoard";
import Forum from "./views/Forum";
import UserProfile from "./views/UserProfile";
import ForumView from "./views/ForumView";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/book-detail/:book_id"
            element={
              <Layout>
                <BookDetail />
              </Layout>
            }
          />{" "}
          <Route
            path="/book-report"
            element={
              <Layout>
                <BookReport />
              </Layout>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <Layout>
                <Leaderboard />
              </Layout>
            }
          />
          <Route
            path="/forum"
            element={
              <Layout>
                <Forum />
              </Layout>
            }
          />
          <Route
            path="/forum/:forum_id"
            element={
              <Layout>
                <ForumView />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <UserProfile />
              </Layout>
            }
          />
          <Route
            path="/profile/:user_id"
            element={
              <Layout>
                <UserProfile />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/reset-password/:token"
            element={<Reset token={true} />}
          />
          <Route path="/reset-password" element={<Reset />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
