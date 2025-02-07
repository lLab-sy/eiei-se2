"use client";

import { Search } from "lucide-react";
import { useState } from "react";

const MAX_STARS = 5;

const SearchBar = () => {
  const [experience, setExperience] = useState(0);
  const [rating, setRating] = useState(0);
  const [query, setQuery] = useState("");

  interface HandleStarClickParams {
    value: number;
    type: "experience" | "rating";
  }

  const handleSearch = () => {
    console.log("Search " + query + " with experience " + experience + " and rating " + rating);
  };

  return (
    <div>
      <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-full">
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded-full px-4 py-2 ml-2 hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>
      <div className="flex items-center space-x-4 mt-4">
        <span className="font-bold text-white">Experience:</span>
        <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-full">
          <input
            type="number"
            placeholder="Minimum Year..."
            className="bg-transparent outline-none w-auto text-gray-700 placeholder-gray-500"
            onChange={(e) => setExperience(Number(e.target.value))}
          />
        </div>
        <span className="font-bold text-white">Rating:</span>
        {[...Array(MAX_STARS)].map((_, i) => (
          <span
            key={i}
            className={`cursor-pointer text-xl ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => setRating(i + 1)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
