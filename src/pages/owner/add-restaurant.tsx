import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../api/createRestaurant";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";

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
  file: FileList;
}

export const AddRestaurant = () => {
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok },
    } = data;
    if (ok) {
      setUploading(false);
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });

  const {
    register,
    getValues,
    formState: { isValid },
    handleSubmit,
  } = useForm<IFormProps>({
    mode: "onChange",
  });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { name, categoryName, address, file } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImage } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImage,
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
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
        <div>
          <input
            {...register("file", {
              required: true,
            })}
            type="file"
            name="file"
            accept="image/*"
            required
          />
        </div>
        <Button
          canClick={isValid}
          loading={uploading}
          actionText={"Create Restaurant"}
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
