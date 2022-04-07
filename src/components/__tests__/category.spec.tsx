import React from "react";
import { render } from "../../test-utils";
import { Category } from "../category";

describe("<Category />", () => {
  it("카테고리 컴포넌트가 렌더링 됩니다.", () => {
    render(<Category slug={"test"} coverImage={null} name={"test"} />);
  });
});
