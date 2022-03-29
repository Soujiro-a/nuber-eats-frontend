import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../api/restaurantsPageQuery";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { Category as CategoryComponent } from "../../components/category";
import { usePage } from "../../hooks/usePage";
import { Page } from "../../components/page";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const { page, onPrevPageClick, onNextPageClick } = usePage();
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const navigate = useNavigate();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    navigate(`/search?term=${searchTerm}`);
  };
  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", { required: true, min: 3 })}
          name="searchTerm"
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search Restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="flex justify-around max-w-sm mx-auto">
            {data?.allCategories.categories?.map((category, index) => (
              <CategoryComponent
                slug={category.slug}
                coverImage={category.coverImage}
                name={category.name}
                key={index}
              />
            ))}
          </div>
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant, index) => (
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
            totalPages={data?.restaurants.totalPages!}
            onPrevPageClick={onPrevPageClick}
            onNextPageClick={onNextPageClick}
          />
        </div>
      )}
    </div>
  );
};
