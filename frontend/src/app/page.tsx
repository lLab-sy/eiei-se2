import Banner from "@/components/Banner";
import ShortKeyList from "@/components/ShortKeyList";
import MovieList from "@/components/MovieList";
import ProfessionalList from "@/components/ProfessionalList";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />
      <ShortKeyList />
      <MovieList />
      <ProfessionalList />
    </div>
  );
}
