import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../api/searchRestaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface ILocationStateProps {
  search: string;
}
export const Search = () => {
  const [page, setPage] = useState(1);

  const [queryReadyToStart, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  const { search } = useLocation() as ILocationStateProps;

  const navigate = useNavigate();

  useEffect(() => {
    const [_, query] = search.split("?term=");
    if (!query) {
      return navigate("/", { replace: true });
    }
    queryReadyToStart({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
    console.log(loading, data, called);
  }, [called, data, loading, navigate, page, queryReadyToStart, search]);
  return (
    <h1>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      Search page
    </h1>
  );
};
