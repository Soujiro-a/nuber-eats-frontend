import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import {
  restaurantPageQuery,
  restaurantPageQueryVariables,
} from "../../api/restaurantPageQuery";
import { RESTAURANT_FRAGMENT } from "../../fragments";

const RESTAURANT_QUERY = gql`
  query restaurantPageQuery($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Restaurant = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<
    restaurantPageQuery,
    restaurantPageQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id!,
      },
    },
  });

  return (
    <div>
      <Helmet>
        <title>Restaurant | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div
          className="bg-gray-800 bg-center bg-cover py-48"
          style={{
            backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
          }}
        >
          <div className="bg-white w-3/12 py-8 pl-48">
            <h4 className="text-4xl mb-3">
              {data?.restaurant.restaurant?.name}
            </h4>
            <h5 className="text-sm font-light mb-2">
              {data?.restaurant.restaurant?.category?.name}
            </h5>
            <h6 className="text-sm font-light">
              {data?.restaurant.restaurant?.address}
            </h6>
          </div>
        </div>
      )}
    </div>
  );
};
