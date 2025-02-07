"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

const MAX_STARS = 5;

const SearchBar = () => {
  const [experience, setExperience] = useState(0);
  const [rating, setRating] = useState(0);

  interface HandleStarClickParams {
    value: number;
    type: "experience" | "rating";
  }

  const handleStarClick = ({ value, type }: HandleStarClickParams) => {
    if (type === "experience") {
      setExperience(value);
    } else {
      setRating(value);
    }
  };

  const handleSearch = () => {
    console.log({ experience, rating });
  };

  return (
    <div>
      <div className="flex items-center space-x-4">
        <span className="font-bold text-white">Experience:</span>
        {[...Array(MAX_STARS)].map((_, i) => (
          <FaStar
            key={i}
            className={`cursor-pointer ${i < experience ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => handleStarClick({ value: i + 1, type: "experience" })}
          />
        ))}
        <span className="font-bold text-white">Rating:</span>
        {[...Array(MAX_STARS)].map((_, i) => (
          <FaStar
            key={i}
            className={`cursor-pointer ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => handleStarClick({ value: i + 1, type: "rating" })}
          />
        ))}
      </div>
      {/* <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 mt-4">
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
        />
      </div> */}
      {/* <button
        onClick={handleSearch}
        className="bg-blue-500 text-white rounded-full px-4 py-2 w-full mt-4 hover:bg-blue-600 transition-colors"
      >
        Apply Filters
      </button> */}
    </div>
  );
};

export default SearchBar;