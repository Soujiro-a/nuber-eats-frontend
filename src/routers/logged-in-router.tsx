import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  const ClientRoute = [
    { path: "/", element: <Restaurants /> },
    { path: "/confirm", element: <ConfirmEmail /> },
    { path: "/edit-profile", element: <EditProfile /> },
    { path: "/search", element: <Search /> },
  ];
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === "Client" &&
          ClientRoute.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
