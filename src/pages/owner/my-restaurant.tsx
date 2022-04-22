import { gql, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { myRestaurant, myRestaurantVariables } from "../../api/myRestaurant";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

export const MyRestaurant = () => {
  const { id } = useParams();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id!,
        },
      },
    }
  );
  console.log(data);
  return (
    <div>
      <Helmet>
        <title>My Restaurant | Nuber Eats</title>
      </Helmet>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link to="add-dish" className="mr-8 text-white bg-gray-800 py-3 px-10">
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0
            ? "등록된 음식이 없습니다."
            : null}
        </div>
      </div>
    </div>
  );
};
