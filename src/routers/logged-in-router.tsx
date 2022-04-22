import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Category } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { AddDish } from "../pages/owner/add-dish";
import { AddRestaurant } from "../pages/owner/add-restaurant";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  const commonRoutes = [
    { path: "/confirm", element: <ConfirmEmail /> },
    { path: "/edit-profile", element: <EditProfile /> },
  ];
  const clientRoutes = [
    { path: "/", element: <Restaurants /> },
    { path: "/search", element: <Search /> },
    { path: "/category/:slug", element: <Category /> },
    { path: "/restaurant/:id", element: <Restaurant /> },
  ];

  const ownerRoutes = [
    { path: "/", element: <MyRestaurants /> },
    { path: "/add-restaurant", element: <AddRestaurant /> },
    { path: "/restaurant/:id", element: <MyRestaurant /> },
    { path: "/restaurant/:id/add-dish", element: <AddDish /> },
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
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        {data.me.role === "Owner" &&
          ownerRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
