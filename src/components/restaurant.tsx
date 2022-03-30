import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: string;
  coverImage: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImage,
  name,
  categoryName,
}) => (
  <Link to={`/restaurant/${id}`}>
    <div className="flex flex-col">
      <div
        className="bg-cover py-28 bg-center mb-3"
        style={{ backgroundImage: `url(${coverImage})` }}
      ></div>
      <h3 className="text-xl font-medium">{name}</h3>
      <span className="border-t mt-3 py-3 text-xs opacity-50 border-gray-400">
        {categoryName}
      </span>
    </div>
  </Link>
);
