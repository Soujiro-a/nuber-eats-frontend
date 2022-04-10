import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import React from "react";
import { UserRole } from "../../../api/globalTypes";
import { ME_QUERY } from "../../../hooks/useMe";
import { render, waitFor } from "../../../test-utils";
import { EditProfile } from "../../user/edit-profile";

describe("<ConfirmEmail />", () => {
  it("Confirm Email 페이지를 렌더링합니다.", async () => {
    const mockedClient = createMockClient();
    render(
      <ApolloProvider client={mockedClient}>
        <EditProfile />
      </ApolloProvider>,
      {
        queries: { ME_QUERY },
      }
    );
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        me: {
          id: 1,
          email: "test@account.com",
          role: UserRole.Client,
          verified: false,
        },
      },
    });
    mockedClient.setRequestHandler(ME_QUERY, mockedMutationResponse);
    await waitFor(() => {
      expect(document.title).toBe("Edit Profile | Nuber Eats");
    });
  });
});
