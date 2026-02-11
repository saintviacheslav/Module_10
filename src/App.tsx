import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Main from "./pages/main/Main";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import NotFound from "./pages/notfound/NotFound";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
function App() {
  return (
    <BrowserRouter basename="/Module_10/">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/signin/" element={<SignIn />} />
          <Route path="/signup/" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<Layout centered={false} />}>
          <Route path="/" element={<Main />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile/" key="profile" element={<Profile />}></Route>
            <Route
              path="/statistics/"
              key="statistics"
              element={<Profile isProfile={false} />}
            ></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
