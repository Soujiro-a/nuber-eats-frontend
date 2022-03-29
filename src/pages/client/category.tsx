import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import {
  categoryPageQuery,
  categoryPageQueryVariables,
} from "../../api/categoryPageQuery";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { Category as CategoryComponent } from "../../components/category";
import { Page } from "../../components/page";
import { usePage } from "../../hooks/usePage";

const CATEGORY_QUERY = gql`
  query categoryPageQuery($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Category = () => {
  const { page, onPrevPageClick, onNextPageClick } = usePage();
  const { slug } = useParams();
  const { data, loading } = useQuery<
    categoryPageQuery,
    categoryPageQueryVariables
  >(CATEGORY_QUERY, {
    variables: {
      input: {
        page,
        slug: slug!,
      },
    },
  });
  return (
    <div>
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="flex justify-around max-w-sm mx-auto">
            {data?.allCategories.categories
              ?.filter((category) => category.slug !== slug)
              .map((category, index) => (
                <CategoryComponent
                  slug={category.slug}
                  coverImage={category.coverImage}
                  name={category.name}
                  key={index}
                />
              ))}
          </div>
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.category.restaurants?.map((restaurant, index) => (
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
            totalPages={data?.category.totalPages!}
            onPrevPageClick={onPrevPageClick}
            onNextPageClick={onNextPageClick}
          />
        </div>
      )}
    </div>
  );
};
