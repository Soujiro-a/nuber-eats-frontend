import React from "react";
import { NotFound } from "../404";
import { render, waitFor } from "../../test-utils";

describe("<NotFound />", () => {
  it("404 NotFound 페이지를 렌더링합니다.", async () => {
    render(<NotFound />);
    await waitFor(() => {
      expect(document.title).toBe("Not Found | Nuber Eats");
    });
  });
});
