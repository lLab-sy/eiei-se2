"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SearchBar = () => {
  return (
    <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-80">
      <Search className="text-gray-500 w-5 h-5 mr-2" />
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
      />
    </div>
  );
};

export default SearchBar;
