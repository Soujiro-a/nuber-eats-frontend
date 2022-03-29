import React from "react";
import { Link } from "react-router-dom";

interface ICategoryProps {
  slug: string;
  coverImage: string | null;
  name: string;
}

export const Category: React.FC<ICategoryProps> = ({
  slug,
  coverImage,
  name,
}) => (
  <Link to={`/category/${slug}`}>
    <div className="flex flex-col group items-center cursor-pointer">
      <div
        className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
        style={{ backgroundImage: `url(${coverImage})` }}
      ></div>
      <span className="mt-1 text-sm text-center font-medium">{name}</span>
    </div>
  </Link>
);
