import { useLocation } from "react-router-dom";

export const useQueryParams = (string: string) => {
  return new URLSearchParams(useLocation().search).get(string);
};
