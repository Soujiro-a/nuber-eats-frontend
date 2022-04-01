import { render, screen } from "@testing-library/react";
import React from "react";
import { Button } from "../button";

describe("button", () => {
  it("클릭할 수 있는 버튼이 렌더링 됩니다.", () => {
    render(<Button canClick={true} loading={false} actionText={"test"} />);
    screen.getByText("test");
  });

  it("로딩 상태인 버튼이 렌더링됩니다.", () => {
    render(<Button canClick={false} loading={true} actionText={"test"} />);
    screen.getByText("Loading...");

    const button = screen.getByRole("button");
    expect(button).toHaveClass("pointer-events-none");
  });
});
