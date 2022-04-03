import { render, waitFor } from "@testing-library/react";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { NotFound } from "../404";
import { BrowserRouter as Router } from "react-router-dom";

describe("404 NotFound Page", () => {
  it("404 NotFound 페이지를 렌더링합니다.", async () => {
    render(
      <HelmetProvider>
        <Router>
          <NotFound />
        </Router>
      </HelmetProvider>
    );
    await waitFor(async () => {
      expect(document.title).toBe("Not Found | Nuber Eats");
    });
  });
});
