import { ApolloProvider } from "@apollo/client";
import userEvent from "@testing-library/user-event";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { UserRole } from "../../../api/globalTypes";
import { ME_QUERY } from "../../../hooks/useMe";
import { render, waitFor, screen } from "../../../test-utils";
import { EditProfile, EDIT_PROFILE_MUITATION } from "../../user/edit-profile";

describe("<ConfirmEmail />", () => {
  let mockedClient: MockApolloClient;
  let mockeduseMeQueryResponse: jest.Mock<any, any>;
  let mockedEditProfileMutationResponse: jest.Mock<any, any>;
  beforeEach(() => {
    mockedClient = createMockClient();
    mockeduseMeQueryResponse = jest.fn().mockResolvedValue({
      data: {
        me: {
          id: 1,
          email: "test@account.com",
          role: UserRole.Client,
          verified: false,
        },
      },
    });
    mockedClient.setRequestHandler(ME_QUERY, mockeduseMeQueryResponse);
    mockedEditProfileMutationResponse = jest.fn().mockResolvedValue({
      data: {
        editProfile: {
          ok: true,
          error: null,
        },
      },
    });
    mockedClient.setRequestHandler(
      EDIT_PROFILE_MUITATION,
      mockedEditProfileMutationResponse
    );
  });
  it("이메일 인증 페이지를 렌더링합니다.", async () => {
    render(
      <ApolloProvider client={mockedClient}>
        <EditProfile />
      </ApolloProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe("Edit Profile | Nuber Eats");
    });
    screen.getByPlaceholderText("Email");
    screen.getByPlaceholderText("Password");
  });
  it("이메일, 비밀번호를 작성 후 확인버튼을 눌렀을 때 실제 처리를 진행합니다.", async () => {
    render(
      <ApolloProvider client={mockedClient}>
        <EditProfile />
      </ApolloProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe("Edit Profile | Nuber Eats");
    });
    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const formData = {
      email: "test@email.com",
      password: "1234",
    };
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockedEditProfileMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(mockedEditProfileMutationResponse).toHaveBeenCalledWith({
      input: {
        email: formData.email,
        password: formData.password,
      },
    });
  });
});
