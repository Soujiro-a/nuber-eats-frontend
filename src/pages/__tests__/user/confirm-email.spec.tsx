import { ApolloProvider } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { createMockClient } from "mock-apollo-client";
import React from "react";
import { ME_QUERY } from "../../../hooks/useMe";
import { render, waitFor } from "../../../test-utils";
import { ConfirmEmail, VERIFY_EMAIL_MUTATION } from "../../user/confirm-email";

describe("<ConfirmEmail />", () => {
  it("Confirm Email 페이지를 렌더링합니다.", async () => {
    const mockedClient = createMockClient();
    render(
      <ApolloProvider client={mockedClient}>
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "",
                    role: "",
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <ConfirmEmail />
        </MockedProvider>
      </ApolloProvider>
    );
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        verifyEmail: {
          ok: true,
          error: "mutation-test-error", // error 부분 테스팅을 위한 임의 값 설정
          __typename: "User",
        },
      },
    });
    mockedClient.setRequestHandler(
      VERIFY_EMAIL_MUTATION,
      mockedMutationResponse
    );
    await waitFor(() => {
      expect(document.title).toBe("Confirm Email | Nuber Eats");
    });
  });
});
