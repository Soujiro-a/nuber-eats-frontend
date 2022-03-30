import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  searchPageQuery,
  searchPageQueryVariables,
} from "../../api/searchPageQuery";
import { Page } from "../../components/page";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { usePage } from "../../hooks/usePage";

const SEARCH_RESTAURANT = gql`
  query searchPageQuery($input: SearchRestaurantInput!) {
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
  const { page, onPrevPageClick, onNextPageClick } = usePage();

  const [queryReadyToStart, { loading, data, called }] = useLazyQuery<
    searchPageQuery,
    searchPageQueryVariables
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
  }, [called, data, loading, navigate, page, queryReadyToStart, search]);

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.searchRestaurant.restaurants?.map((restaurant, index) => (
              <Restaurant
                id={restaurant.id + ""}
                coverImage={restaurant.coverImage}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
                key={index}
              />
            ))}
          </div>
          <Page
            page={page}
            totalPages={data?.searchRestaurant.totalPages!}
            onPrevPageClick={onPrevPageClick}
            onNextPageClick={onNextPageClick}
          />
        </div>
      )}
    </div>
  );
};
