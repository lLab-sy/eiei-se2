"use client";

import { useParams } from "next/navigation";

const ProfessionalDetail = () => {
  const { id } = useParams();

  // Replace with an actual API call or fetch function
  // For testing
  const service = {
    id,
    title: `Service ${id}`,
    description: "This is a detailed description of the service.",
    price: "฿9927",
    rating: 3.3,
    mediaType: "Video Production",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{service.title}</h1>
      <p className="mt-2">{service.description}</p>
      <p className="mt-2">⭐ {service.rating} / 5</p>
      <p className="mt-2 font-semibold">{service.mediaType}</p>
      <p className="mt-2 text-lg font-bold">{service.price}</p>
    </div>
  );
};

export default ProfessionalDetail;
