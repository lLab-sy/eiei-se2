"use client";

import { Search } from "lucide-react";
import { useState } from "react";

const mediaOptions = ["Movie", "TV Show", "Music", "Podcast", "Book", "Game"];
const roleOptions = ["Admin", "Editor", "Viewer"];

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [openType, setOpenType] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleModal = (type: string) => {
    if(type === "Media") setOptions(mediaOptions);
    else setOptions(roleOptions);

    setOpenType(type);
    setIsModalOpen(!isModalOpen);
  };

  const handleOptionSelection = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((m) => m !== option) : [...prev, option]
    );
  };

  function confirmButton(openType: string): void {
    console.log(`Selected ${openType}:`, selectedOptions);
    setIsModalOpen(false);
  }

  const handleSearch = () => {
    console.log("Search " + query);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <div>
      <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-full">
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
          onChange={handleSearchChange}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded-full px-4 py-2 ml-2 hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>
      <div className="relative flex items-center gap-4 px-4 w-full mt-4"> 
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => toggleModal("Media")}
        >
          Select Media Type
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => toggleModal("Role")}
        >
          Select Role 
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-lg font-semibold mb-4">Select {openType}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {options.map((option) => (
                  <button
                    key={option}
                    className={`px-3 py-1 rounded-full border ${selectedOptions.includes(option) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleOptionSelection(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={() => toggleModal(openType)}>Cancel</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => confirmButton(openType)}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
