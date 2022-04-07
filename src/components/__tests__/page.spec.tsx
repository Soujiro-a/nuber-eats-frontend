import React from "react";
import { render, screen } from "../../test-utils";
import { Page } from "../page";

describe("<Page />", () => {
  it("페이지 이동 컴포넌트가 첫 페이지인 상태로 렌더링 됩니다.", () => {
    render(
      <Page
        page={1}
        totalPages={3}
        onPrevPageClick={() => null}
        onNextPageClick={() => null}
      />
    );
    screen.getByText("→");
    expect(screen.queryByText("←")).toBeNull();
  });
  it("페이지 이동 컴포넌트가 중간 페이지인 상태로 렌더링 됩니다.", () => {
    render(
      <Page
        page={2}
        totalPages={3}
        onPrevPageClick={() => null}
        onNextPageClick={() => null}
      />
    );
    screen.getByText("←");
    screen.getByText("→");
  });

  it("페이지 이동 컴포넌트가 마지막 페이지인 상태로 렌더링 됩니다.", () => {
    render(
      <Page
        page={3}
        totalPages={3}
        onPrevPageClick={() => null}
        onNextPageClick={() => null}
      />
    );
    screen.getByText("←");
    expect(screen.queryByText("→")).toBeNull();
  });
});
