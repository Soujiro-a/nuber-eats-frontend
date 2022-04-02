import { render, screen } from "@testing-library/react";
import React from "react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("Restaurant", () => {
  it("레스토랑 컴포넌트가 렌더링 됩니다.", () => {
    const restaurantProps = {
      id: "1",
      name: "testName",
      categoryName: "testCategory",
      coverImage: "testCoverImage",
    };
    render(
      <Router>
        <Restaurant {...restaurantProps} />
      </Router>
    );
    screen.getByText(restaurantProps.name);
    screen.getByText(restaurantProps.categoryName);

    const anchor = screen.getByRole("link");
    expect(anchor).toHaveAttribute("href", `/restaurant/${restaurantProps.id}`);
  });
});
