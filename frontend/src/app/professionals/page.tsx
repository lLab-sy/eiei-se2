import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";

const ProfessionalsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        <NavBar />
        <SearchBar />
      <p className="text-lg text-gray-600">
        Suggested Production Professional
      </p>
        <Footer />
    </div>
  );
};

export default ProfessionalsPage;
