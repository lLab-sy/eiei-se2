import React from "react";
import Link from "next/link";

interface ProfessionalCradProp {
  title: string;
  role: string[];
  description: string;
  ratings: number;
  mediaType: string;
  price: string;
  imageUrl: string;
  id: string;
}

const ProfessionalCrad: React.FC<ProfessionalCradProp> = ({
  title,
  role,
  description,
  ratings,
  mediaType,
  price,
  imageUrl,
  id,
}) => {
    return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="flex flex-col flex-1 p-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>

        {/* Role badges */}
        <div className="flex flex-wrap gap-2 mt-2">
            {role.map((item, index) => (
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
            <span>⭐ {ratings.toFixed(1)} / 5</span>
            <span className="italic">{mediaType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-mainblue-lightest font-bold">{price}</span>
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

export default ProfessionalCrad;
