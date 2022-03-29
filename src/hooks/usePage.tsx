import { useState } from "react";

export const usePage = (startPage: number = 1) => {
  const [page, setPage] = useState(startPage);

  const onPrevPageClick = () => setPage((current) => current - 1);
  const onNextPageClick = () => setPage((current) => current + 1);

  return { page, onPrevPageClick, onNextPageClick };
};
