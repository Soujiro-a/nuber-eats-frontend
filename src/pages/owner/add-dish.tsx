import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FieldArray,
  FieldArrayMethodProps,
  FieldArrayPath,
  FieldValues,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createDish, createDishVariables } from "../../api/createDish";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import { v4 as uuidv4 } from "uuid";

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

export type UseFieldArrayReturn<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id" | "choices"
> = {
  swap: (indexA: number, indexB: number) => void;
  move: (indexA: number, indexB: number) => void;
  prepend: (
    value:
      | Partial<FieldArray<TFieldValues, TFieldArrayName>>
      | Partial<FieldArray<TFieldValues, TFieldArrayName>>[],
    options?: FieldArrayMethodProps
  ) => void;
  append: (
    value:
      | Partial<FieldArray<TFieldValues, TFieldArrayName>>
      | Partial<FieldArray<TFieldValues, TFieldArrayName>>[],
    options?: FieldArrayMethodProps
  ) => void;
  remove: (index?: number | number[]) => void;
  insert: (
    index: number,
    value:
      | Partial<FieldArray<TFieldValues, TFieldArrayName>>
      | Partial<FieldArray<TFieldValues, TFieldArrayName>>[],
    options?: FieldArrayMethodProps
  ) => void;
  update: (
    index: number,
    value: Partial<FieldArray<TFieldValues, TFieldArrayName>>
  ) => void;
  replace: (
    value:
      | Partial<FieldArray<TFieldValues, TFieldArrayName>>
      | Partial<FieldArray<TFieldValues, TFieldArrayName>>[]
  ) => void;
  fields: FieldArrayWithId<FieldValues, TFieldArrayName, TKeyName>[];
};

export type FieldArrayWithId<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id" | "choices"
> = FieldArray<TFieldValues, TFieldArrayName> & Record<TKeyName, string>;

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
      options: [],
    },
  });
  const { fields, append, remove }: UseFieldArrayReturn = useFieldArray<
    IFormProps,
    string,
    "id" | "choices"
  >({
    control,
    name: "options",
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const optionsObject = fields.map((field, index) => ({
      name: rest[`${field.id}-optionName`] + "",
      extra: +rest[`${field.id}-optionNameExtra`],
      choices: choices[index].map((choice) => ({
        name: rest[`${choice}-choiceName`] + "",
        extra: +rest[`${choice}-choiceNameExtra`],
      })),
    }));
    console.log(rest.options);
    console.log(choices);
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
  const [choices, setChoices] = useState<string[][]>([]);
  const onAddOptionClick = () => {
    append({});
    setChoices((current) => [...current, []]);
  };
  const onDeleteOptionClick = (idToDelete: number) => {
    remove(idToDelete);
  };
  const onAddChoiceOptionClick = (index: number) => {
    setChoices((current) =>
      current.map((c, cIndex) => {
        if (cIndex !== index) {
          return c;
        } else {
          return [...c, uuidv4()];
        }
      })
    );
  };
  const onDeleteChoiceOptionClick = (idToDelete: string) => {
    setChoices((current) =>
      current.map((c, cIndex) =>
        c.filter((choiceId) => choiceId !== idToDelete)
      )
    );
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
            <div
              key={field.id}
              className="flex flex-row flex-wrap items-center mt-5"
            >
              <input
                {...register(`${field.id}-optionName`)}
                name={`${field.id}-optionName`}
                className="input w-1/3 text-sm mr-3"
                type="text"
                placeholder="Option Name"
              />
              <input
                {...register(`${field.id}-optionNameExtra`)}
                name={`${field.id}-optionNameExtra`}
                className="input w-1/4 text-sm"
                type="number"
                min={0}
                placeholder="Option Extra"
              />
              <span
                className="cursor-pointer text-white bg-gray-900 ml-2 py-1 px-2"
                onClick={() => onAddChoiceOptionClick(index)}
              >
                Add Choice
              </span>
              <span
                className="cursor-pointer text-white bg-red-500 ml-2 py-1 px-2"
                onClick={() => onDeleteOptionClick(index)}
              >
                Delete Option
              </span>
              <>
                {choices[index].map((choiceId, cIndex) => (
                  <div key={choiceId} className="flex items-center mt-2 ml-16">
                    <input
                      {...register(`${choiceId}-choiceName`)}
                      name={`${choiceId}-choiceName`}
                      className="input w-1/3 text-sm mr-3"
                      type="text"
                      placeholder="Choice Name"
                    />
                    <input
                      {...register(`${choiceId}-choiceNameExtra`)}
                      name={`${choiceId}-choiceNameExtra`}
                      className="input w-1/4 text-sm"
                      type="number"
                      min={0}
                      placeholder="Choice Extra"
                    />

                    <span
                      className="cursor-pointer text-white bg-red-500 ml-2 py-1 px-2"
                      onClick={() => onDeleteChoiceOptionClick(choiceId)}
                    >
                      Delete Choice
                    </span>
                  </div>
                ))}
              </>
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
