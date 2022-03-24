import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Restaurants } from "../pages/client/restaurants";
import { ConfirmEmail } from "../pages/user/confirm-email";

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
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
        {
          (data.me.role === "Client" && (
            <Route path="/" element={<Restaurants />} />
          ),
          (<Route path="/confirm" element={<ConfirmEmail />} />))
        }
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
