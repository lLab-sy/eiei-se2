"use client";

import { Search } from "lucide-react";
import { useState } from "react";

const MAX_STARS = 5;

interface SearchBarProps {
  onSearch: (filter: string, rating: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({onSearch}) => {
  const [minExp, setMinExp] = useState(0);
  const [maxExp, setMaxExp] = useState(0);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleSearch = (rating: number) => {
    var result = "";

    if(text != "") result += "&searchText="+text;
    if(minExp != 0) result += "&minExperience="+minExp.toString();
    if(maxExp != 0) result += "&maxExperience="+maxExp.toString();

    onSearch(result, rating);
  };

  return (
    <div>
      <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-full">
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={() => handleSearch(rating)}
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
            placeholder="Min"
            className="bg-transparent outline-none w-12 text-gray-700 placeholder-gray-500"
            onChange={(e) => setMinExp(Number(e.target.value))}
          />

        </div>
        <span className="font-bold text-white">-</span>
        <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-full">
          <input
            type="number"
            placeholder="Max"
            className="bg-transparent outline-none w-12 text-gray-700 placeholder-gray-500"
            onChange={(e) => setMaxExp(Number(e.target.value))}
          />

        </div>
        <span className="font-bold text-white">Rating:</span>
        {[...Array(MAX_STARS)].map((_, i) => (
          <span
            key={i}
            className={`cursor-pointer text-xl ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => {setRating(i + 1); handleSearch(i + 1);}}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
