'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  title: string;
  image: string;
  id: string;
}

const movies: Movie[] = [
  { title: 'Fast Feel Love', image: '/api/placeholder/300/200', id: '1' },
  { title: 'Haunted Universities', image: '/api/placeholder/300/200', id: '2' },
  { title: 'Friend Zone', image: '/api/placeholder/300/200', id: '3' },
  { title: 'Shadow & Bone', image: '/api/placeholder/300/200', id: '4' },
  { title: 'Gladiator', image: '/api/placeholder/300/200', id: '5' },
  { title: 'JURASSIC PARK', image: '/api/placeholder/300/200', id: '6' },
  { title: 'Titanic', image: '/api/placeholder/300/200', id: '7' }
];

const MovieList: FC = () => {
  return (
    <section className="container mx-auto py-4 sm:py-6 md:py-8 px-4">
      <div className="flex justify-between items-center mb-4 sm:mb-6 text-gray-600">
        <h2 className="text-xl sm:text-2xl font-bold">Movie</h2>
        <Link href="/movies" className="text-blue-600 hover:text-blue-800 text-sm sm:text-base">
          See more ...
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id} className="group">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image 
                src={movie.image} 
                alt={movie.title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity text-center px-2">
                  {movie.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MovieList;