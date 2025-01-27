'use client';

import { FC } from 'react';
import Link from 'next/link';

interface Category {
  name: string;
  icon: string;
  href: string;
}

const categories: Category[] = [
  { name: 'Movie', icon: '🎬', href: '/movie' },
  { name: 'Short', icon: '📽️', href: '/short' },
  { name: 'Drama', icon: '🎭', href: '/drama' },
  { name: 'Ads', icon: '📢', href: '/ads' }
];

const ShortKeyList: FC = () => {
  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-gray-600">
        {categories.map((category, index) => (
          <Link 
            href={category.href} 
            key={index} 
            className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <span className="text-2xl sm:text-3xl md:text-4xl mb-2">{category.icon}</span>
            <span className="font-medium text-sm sm:text-base">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShortKeyList;