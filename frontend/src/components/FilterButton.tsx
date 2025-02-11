import React from "react";

interface FilterButtonProps {
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ className = "" }) => {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition duration-300">
      Filter
    </button>
  );
};

export default FilterButton;
