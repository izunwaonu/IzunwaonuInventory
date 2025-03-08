import React from "react";
import { FaStar } from "react-icons/fa";

type StarRatingProps = {
  count: number;
};

const StarRating: React.FC<StarRatingProps> = ({ count }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }, (_, index) => (
        <FaStar className="text-orange-400 w-5 h-5" key={index} />
      ))}
    </div>
  );
};

export default StarRating;
