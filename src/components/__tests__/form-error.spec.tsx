import { render, screen } from "@testing-library/react";
import React from "react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
  it("에러 타입의 폼이 렌더링됩니다.", () => {
    render(<FormError errorMessage="test" />);
    screen.getByText("test");
  });
});
