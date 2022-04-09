import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import React from "react";
import { render, waitFor, screen } from "../../../test-utils";
import { ConfirmEmail } from "../../user/confirm-email";

const mockEffect = jest.fn();

jest.mock("react", () => {
  const realModule = jest.requireActual("react");
  return {
    ...realModule,
    useEffect: () => mockEffect,
  };
});

describe("<ConfirmEmail />", () => {
  it("Confirm Email 페이지를 렌더링합니다.", async () => {
    const mockedClient = createMockClient();
    render(
      <ApolloProvider client={mockedClient}>
        <ConfirmEmail />
      </ApolloProvider>
    );
    await waitFor(async () => {
      expect(document.title).toBe("Confirm Email | Nuber Eats");
    });
    screen.getByText("이메일 인증중입니다...");
    screen.getByText("이 페이지를 끄지 말고 기다려주세요...");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
