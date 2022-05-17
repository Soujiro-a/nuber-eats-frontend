import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { editOrder, editOrderVariables } from "../api/editOrder";
import { getOrder, getOrderVariables } from "../api/getOrder";
import { OrderStatus, UserRole } from "../api/globalTypes";
import { orderUpdates } from "../api/orderUpdates";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { useMe } from "../hooks/useMe";

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER_MUTATION = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

export const Order = () => {
  const { id } = useParams();
  const { data: userData } = useMe();
  const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(
    EDIT_ORDER_MUTATION
  );
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER,
    {
      variables: {
        input: {
          id: +id!,
        },
      },
    }
  );

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +id!,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) {
            return prev;
          }

          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data, id, subscribeToMore]);
  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: +id!,
          status: newStatus,
        },
      },
    });
  };
  return (
    <div>
      <Helmet>
        <title>Order #{id} | Nuber Eats</title>
      </Helmet>
      <div className="mt-32 container flex justify-center">
        <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
          <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
            Order #{id}
          </h4>
          <h5 className="p-5 pt-10 text-3xl text-center ">
            ₩{data?.getOrder.order?.total}
          </h5>
          <div className="p-5 text-xl grid gap-6">
            <div className="border-t pt-5 border-gray-700">
              Prepared By:{" "}
              <span className="font-medium">
                {data?.getOrder.order?.restaurant?.name}
              </span>
            </div>
            <div className="border-t pt-5 border-gray-700 ">
              Deliver To:{" "}
              <span className="font-medium">
                {data?.getOrder.order?.customer?.email}
              </span>
            </div>
            <div className="border-t border-b py-5 border-gray-700">
              Driver:{" "}
              <span className="font-medium">
                {data?.getOrder.order?.driver?.email || "Not yet."}
              </span>
            </div>
            {userData?.me.role === "Client" && (
              <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                Status: {data?.getOrder.order?.status}
              </span>
            )}
            {userData?.me.role === UserRole.Owner && (
              <>
                {data?.getOrder.order?.status === OrderStatus.Pending && (
                  <button
                    onClick={() => onButtonClick(OrderStatus.Cooking)}
                    className="btn"
                  >
                    주문 수락하기
                  </button>
                )}
                {data?.getOrder.order?.status === OrderStatus.Cooking && (
                  <button
                    onClick={() => onButtonClick(OrderStatus.Cooked)}
                    className="btn"
                  >
                    요리 완료
                  </button>
                )}
                {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                  data?.getOrder.order?.status !== OrderStatus.Pending && (
                    <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                      Status: {data?.getOrder.order?.status}
                    </span>
                  )}
              </>
            )}
            {userData?.me.role === UserRole.Delivery && (
              <>
                {data?.getOrder.order?.status === OrderStatus.Cooked && (
                  <button
                    onClick={() => onButtonClick(OrderStatus.PickedUp)}
                    className="btn"
                  >
                    픽업 하기
                  </button>
                )}
                {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                  <button
                    onClick={() => onButtonClick(OrderStatus.Delivered)}
                    className="btn"
                  >
                    배달 완료
                  </button>
                )}
              </>
            )}
            {data?.getOrder.order?.status === OrderStatus.Delivered && (
              <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                Nuber Eats 서비스를 이용해주셔서 감사합니다!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
