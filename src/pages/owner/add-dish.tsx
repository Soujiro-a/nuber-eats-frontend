import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createDish, createDishVariables } from "../../api/createDish";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  price: string;
  description: string;
  [key: string]: string | any;
  options: { id?: string; choices?: { id: string; key: number }[] }[];
}

export const AddDish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [createDishMutation, { data, loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +id!,
          },
        },
      },
    ],
  });
  const {
    register,
    getValues,
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      options: [{}],
    },
  });
  const { fields, append, remove, update } = useFieldArray<IFormProps>({
    control,
    name: "options",
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const optionsObject = fields.map(({ id }) => ({
      name: rest[`${id}-optionName`] + "",
      extra: +rest[`${id}-optionNameExtra`],
    }));
    console.log(optionsObject);
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price!,
          description,
          restaurantId: +id!,
          options: optionsObject,
        },
      },
    });
    navigate(-1);
  };
  const onAddOptionClick = () => {
    append({ choices: [] });
  };
  const onDeleteOptionClick = (idToDelete: number) => {
    remove(idToDelete);
  };
  const onAddChoiceOptionClick = (field: any, index: number) => {
    const newValue = field.choices.length !== 0 ? field.choices[0]?.key + 1 : 0;
    update(index, {
      choices: [
        {
          key: newValue,
          id: `${field.id}-optionChoices-${newValue}`,
        },
        ...field.choices,
      ],
    });
  };
  const onDeleteChoiceOptionClick = (
    keyToDelete: number,
    field: any,
    index: number
  ) => {
    // @ts-ignore
    const deletedChoices = field.choices?.filter((f) => f !== keyToDelete);
    update(index, { choices: [...deletedChoices] });
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h1 className="font-semibold text-2xl mb-3">Add Dish</h1>
      <form
        className="grid max-w-screen-sm gap-3 w-full my-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("name", { required: "음식 이름이 필요합니다" })}
          name="name"
          placeholder="Name"
          required
          type="text"
          className="input"
        />
        <input
          {...register("price", { required: "음식 가격이 필요합니다" })}
          name="price"
          placeholder="Price"
          required
          min={0}
          type="number"
          className="input"
        />
        <input
          {...register("description", {
            required: "음식 설명이 필요합니다",
            minLength: 5,
          })}
          name="description"
          placeholder="Description"
          required
          type="text"
          className="input"
          minLength={5}
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
          >
            Add Dish Option
          </span>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center mt-5">
              <input
                {...register(`${field.id}-optionName`)}
                name={`${field.id}-optionName`}
                className="input text-sm mr-3"
                type="text"
                placeholder="Option Name"
              />
              <input
                {...register(`${field.id}-optionNameExtra`)}
                name={`${field.id}-optionNameExtra`}
                className="input text-sm"
                type="number"
                min={0}
                placeholder="Option Extra"
              />
              <span
                className="cursor-pointer text-white bg-gray-900 ml-3 py-1 px-2"
                onClick={() => onAddChoiceOptionClick(field, index)}
              >
                Add Choice
              </span>
              <span
                className="cursor-pointer text-white bg-red-500 ml-3 py-1 px-2"
                onClick={() => onDeleteOptionClick(index)}
              >
                Delete Option
              </span>
            </div>
          ))}
        </div>
        <Button
          canClick={isValid}
          loading={loading}
          actionText={"Create Dish"}
        />
        {data?.createDish.error && (
          <FormError errorMessage={data.createDish.error} />
        )}
      </form>
    </div>
  );
};
