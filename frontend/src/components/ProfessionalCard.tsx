import React from "react";
import Link from "next/link";
import { Award } from "lucide-react";

interface ProfessionalCardProp {
  title: string;
  skill: string[];
  description: string;
  ratings: number;
  occupation: string;
  imageUrl: string;
  id: string;
  experience: number;
}

const ProfessionalCard: React.FC<ProfessionalCardProp> = ({
  title,
  skill,
  description,
  ratings,
  occupation,
  imageUrl,
  experience,
  id,
}) => {
    return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img src={imageUrl.length === 0 ? 'image/logo-preview.webp' : imageUrl.replace(/\.(jpg|png)$/, ".webp")} alt={title} className="w-full h-48 object-cover" />
        <div className="flex flex-col flex-1 p-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>

        {/* Role badges */}
        <div className="flex flex-wrap gap-2 mt-2">
            {skill.map((item, index) => (
            <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full">
                {item}
            </span>
            ))}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-2">{description}</p>

        {/* Footer Section */}
        <div className="mt-auto pt-10">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <Award className="h-5 w-5 text-mainblue-lightest" />
            <span className="text-maingrey">{experience} years</span>
            <span className="italic ml-auto">{occupation}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>⭐ {ratings.toFixed(1)} / 5</span>
            <Link href={`/professionals/${id}`}>
              <button className="bg-mainblue-lightest text-white px-4 py-2 rounded-full text-sm hover:bg-mainblue-dark">
                View More
              </button>
            </Link>
          </div>
        </div>
        </div>
    </div>
    );
};

export default ProfessionalCard;
