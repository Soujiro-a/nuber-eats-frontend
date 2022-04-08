import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmail, verifyEmailVariables } from "../../api/verifyEmail";
import { useMe } from "../../hooks/useMe";
import { useQueryParams } from "../../hooks/useQueryParams";
import { Helmet } from "react-helmet-async";

export const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const navigate = useNavigate();
  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      navigate("/", { replace: true });
    }
  };
  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    }
  );
  const verifyCode = useQueryParams("code");
  useEffect(() => {
    verifyEmail({
      variables: {
        input: {
          code: verifyCode!,
        },
      },
    });
  });
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Confirm Email | Nuber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-1 font-medium">이메일 인증중입니다...</h2>
      <h4 className="text-gray-700 text-sm">
        이 페이지를 끄지 말고 기다려주세요...
      </h4>
    </div>
  );
};
