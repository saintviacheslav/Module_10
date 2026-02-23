import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Main from "./pages/main/Main";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import NotFound from "./pages/notfound/NotFound";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { Box, CircularProgress } from "@mui/material";

const ProfileInfo = lazy(() => import("./components/ProfileInfo/ProfileInfo"));
const Statistics = lazy(() => import("./components/Statistics/Statistics"));
function App() {
  return (
    <BrowserRouter basename="/Module_10/">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/signin/" element={<SignIn />} />
          <Route path="/signup/" element={<SignUp />} />
          <Route path="/" element={<Main />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile/*" element={<Profile />}>
              <Route index element={<Navigate to="info" replace />} />
              <Route
                path="info"
                element={
                  <Suspense
                    fallback={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "50vh",
                        }}
                      >
                        <CircularProgress size={60} thickness={4} />
                      </Box>
                    }
                  >
                    <ProfileInfo />
                  </Suspense>
                }
              />
              <Route
                path="statistics"
                element={
                  <Suspense
                    fallback={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "50vh",
                        }}
                      >
                        <CircularProgress size={60} thickness={4} />
                      </Box>
                    }
                  >
                    <Statistics />
                  </Suspense>
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
