import React from "react";
import { Header } from "../header";
import { MockedProvider } from "@apollo/client/testing";
import { ME_QUERY } from "../../hooks/useMe";
import { render, screen, waitFor } from "../../test-utils";

describe("<Header />", () => {
  it("이메일 인증 요구 배너가 달린 헤더가 렌더링됩니다.", async () => {
    render(
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
        <Header />
      </MockedProvider>
    );
    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    screen.getByText("이메일 인증을 완료해주세요");
  });
  it("이메일 인증 요구 배너가 없는 헤더가 렌더링됩니다.", async () => {
    render(
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
                  verified: true,
                },
              },
            },
          },
        ]}
      >
        <Header />
      </MockedProvider>
    );
    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.queryByText("이메일 인증을 완료해주세요")).toBeNull();
  });
});
