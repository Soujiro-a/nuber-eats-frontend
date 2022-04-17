import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../api/createRestaurant";
import { Button } from "../../components/button";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurant = () => {
  const [createRestaurantMutation, { loading, data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION);
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormProps>({
    mode: "onChange",
  });
  const onSubmit = () => {
    console.log(getValues());
  };
  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h1>Add Restaurants</h1>
      <form
        className="grid gap-3 mt-5 w-full mb-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("name", { required: "음식점 이름이 필요합니다" })}
          name="name"
          placeholder="Name"
          required
          type="text"
          className="input"
        />
        <input
          {...register("address", { required: "음식점 주소가 필요합니다" })}
          name="address"
          placeholder="Address"
          required
          type="text"
          className="input"
        />
        <input
          {...register("categoryName", {
            required: "음식점 카테고리가 필요합니다",
          })}
          name="categoryName"
          placeholder="CategoryName"
          required
          type="text"
          className="input"
        />
        <Button
          canClick={isValid}
          loading={loading}
          actionText={"Create Restaurant"}
        />
      </form>
    </div>
  );
};
