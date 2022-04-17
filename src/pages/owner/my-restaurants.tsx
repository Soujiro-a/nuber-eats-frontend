import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { myRestaurants } from "../../api/myRestaurants";
import { RESTAURANT_FRAGMENT } from "../../fragments";

const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>

        {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 && (
          <>
            <h4 className="text-xl mb-5">등록된 음식점이 없습니다.</h4>
            <Link className="link" to="/add-restaurant">
              음식점을 등록하세요! &rarr;
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
