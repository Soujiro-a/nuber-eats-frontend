import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { meQuery } from "../api/meQuery";
import { Header } from "../components/header";
import { NotFound } from "../pages/404";
import { Restaurants } from "../pages/client/restaurants";

const ClientRoutes = [<Route path="/" element={<Restaurants />} />];

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
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
        {data.me.role === "Client" && ClientRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
