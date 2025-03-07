"use client";

import Image from "next/image";
import { FC } from "react";

interface BannerProps {
  title?: string;
  imageUrl?: string;
}

const Banner: FC<BannerProps> = ({
  // title = "ON Recruiting", temp placeholder
  title = "",
  imageUrl = "/api/placeholder/1200/400",
}) => {
  return (
    <div className="relative h-48 sm:h-64 md:h-96 bg-gradient-to-r from-blue-600 to-purple-600">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
          {/*title*/} ON Recruiting {/*temp placeholder for title*/}
        </h1>
      </div>
    </div>
  );
};

export default Banner;
