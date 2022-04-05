import React from "react";
import { Restaurant } from "../restaurant";
import { render, screen } from "../../test-utils";

describe("<Restaurant />", () => {
  it("레스토랑 컴포넌트가 렌더링 됩니다.", () => {
    const restaurantProps = {
      id: "1",
      name: "testName",
      categoryName: "testCategory",
      coverImage: "testCoverImage",
    };
    render(<Restaurant {...restaurantProps} />);
    screen.getByText(restaurantProps.name);
    screen.getByText(restaurantProps.categoryName);

    const anchor = screen.getByRole("link");
    expect(anchor).toHaveAttribute("href", `/restaurant/${restaurantProps.id}`);
  });
});
