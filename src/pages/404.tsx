import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="h-screen flex flex-col justify-center items-center">
    <Helmet>
      <title>Not Found | Nuber Eats</title>
    </Helmet>
    <h2 className="font-semibold text-2xl mb-3">
      해당 페이지를 찾을 수 없습니다.
    </h2>
    <Link className="hover:underline text-lime-600" to="/">
      메인 페이지로 돌아가기 &rarr;
    </Link>
  </div>
);
