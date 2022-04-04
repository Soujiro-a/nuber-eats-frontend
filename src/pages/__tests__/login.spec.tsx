import { render, waitFor, screen } from "@testing-library/react";
import React from "react";
import { Login, LOGIN_MUTATION } from "../login";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import userEvent from "@testing-library/user-event";
import { LOCALSTORAGE_TOKEN } from "../../constants";

describe("<Login />", () => {
  let mockedClient: MockApolloClient;
  beforeEach(() => {
    mockedClient = createMockClient();
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(
      <ApolloProvider client={mockedClient}>
        <HelmetProvider>
          <Router>
            <Login />
          </Router>
        </HelmetProvider>
      </ApolloProvider>
    );
  });
  it("로그인 페이지가 렌더링 됩니다.", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });
  it("이메일 작성 시 발생하는 에러를 표시합니다.", async () => {
    const email = screen.getByPlaceholderText("Email");
    userEvent.type(email, "this@wrong");
    await waitFor(() => {
      screen.getByText("유효한 이메일을 입력해주세요");
    });
    userEvent.clear(email);
    await waitFor(() => {
      screen.getByText("이메일은 필수 입력 항목입니다");
    });
  });
  it("비밀번호 미작성 시 발생하는 에러를 표시합니다.", async () => {
    const email = screen.getByPlaceholderText("Email");
    userEvent.type(email, "this@correct.com");
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
    await waitFor(() => {
      screen.getByText("비밀번호는 필수 입력 항목입니다");
    });
  });
  it("이메일, 비밀번호 작성 후 확인 버튼을 눌렀을 때 실제 처리를 불러옵니다.", async () => {
    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const formData = {
      email: "test@email.com",
      password: "1234",
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "testToken",
          error: "mutation-test-error", // error 부분 테스팅을 위한 임의 값 설정
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, "setItem");
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
    screen.getByText("mutation-test-error");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCALSTORAGE_TOKEN,
      "testToken"
    );
  });
});
