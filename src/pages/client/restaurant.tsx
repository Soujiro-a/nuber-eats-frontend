import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { createOrder, createOrderVariables } from "../../api/createOrder";
import { CreateOrderItemInput } from "../../api/globalTypes";
import {
  restaurantPageQuery,
  restaurantPageQueryVariables,
} from "../../api/restaurantPageQuery";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";

const RESTAURANT_QUERY = gql`
  query restaurantPageQuery($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
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

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

export const Restaurant = () => {
  const { id } = useParams();
  const { data } = useQuery<restaurantPageQuery, restaurantPageQueryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +id!,
        },
      },
    }
  );
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  const navigate = useNavigate();
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (ok) {
      alert("주문을 완료했습니다.");
      navigate(`/orders/${orderId}`, { replace: true });
    }
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });
  const triggerConfirmOrder = () => {
    if (placingOrder) {
      return;
    }
    if (orderItems.length === 0) {
      alert("주문할 음식이 선택되지 않았습니다.");
      return;
    }
    const ok = window.confirm("주문하시겠습니까?");
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +id!,
            items: orderItems,
          },
        },
      });
    }
  };

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };

  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };

  const addOptionToItem = (dishId: number, optionName: any) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((oldOption) => oldOption.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...current,
        ]);
      }
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
        ...current,
      ]);
    }
  };

  const addChoiceToOption = (
    dishId: number,
    optionName: string,
    choiceName: string
  ) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((oldOption) => oldOption.name === optionName)
      );
      if (hasOption) {
        const hasChoice = Boolean(
          oldItem.options?.find((oldOption) => oldOption.choice === choiceName)
        );
        if (!hasChoice) {
          removeFromOrder(dishId);
          setOrderItems((current) => [
            {
              dishId,
              options: [
                { name: optionName, choice: choiceName },
                ...oldItem.options?.filter(
                  (oldOption) => oldOption.name !== optionName
                )!,
              ],
            },
            ...current,
          ]);
        }
      }
    }
  };
  const getChoiceFromItem = (
    item: CreateOrderItemInput,
    choiceName: string
  ) => {
    return item.options?.find((option) => option.choice === choiceName);
  };
  const isChoiceSelected = (dishId: number, choiceName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getChoiceFromItem(item, choiceName));
    }
    return false;
  };
  const removeChoiceFromOption = (
    dishId: number,
    optionName: string,
    choiceName: string
  ) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId,
          options: [
            { name: optionName },
            ...oldItem.options?.filter(
              (option) => option.choice !== choiceName
            )!,
          ],
        },
        ...current,
      ]);
    }
  };
  console.log(orderItems);
  return (
    <div>
      <Helmet>
        <title>Restaurant | Nuber Eats</title>
      </Helmet>
      <div
        className="bg-gray-800 bg-center bg-cover py-48"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white w-3/12 py-8 pl-28">
          <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="container flex flex-col items-end mt-20 pb-32">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10">
            주문 시작하기
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              주문 하기
            </button>
            <button
              onClick={triggerCancelOrder}
              className="btn px-10 bg-red-500 hover:bg-red-500"
            >
              주문 취소하기
            </button>
          </div>
        )}

        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurant.restaurant?.menu.map((dish) => (
            <Dish
              key={dish.id}
              isSelected={isSelected(dish.id)}
              id={dish.id}
              orderStarted={orderStarted}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  isOptionSelected={isOptionSelected(dish.id, option.name)}
                  isChoiceSelected={isChoiceSelected}
                  name={option.name}
                  extra={option.extra}
                  dishId={dish.id}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                  choices={option.choices!}
                  addChoiceToOption={addChoiceToOption}
                  removeChoiceFromOption={removeChoiceFromOption}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
