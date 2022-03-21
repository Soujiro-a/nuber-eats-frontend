import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => {
  return (
    <button
      className={`py-4 text-lg focus:outline-none font-medium text-white  transition-colors ${
        canClick
          ? "bg-lime-600 hover:bg-green-700"
          : "bg-gray-300 pointer-events-none"
      }`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
};
