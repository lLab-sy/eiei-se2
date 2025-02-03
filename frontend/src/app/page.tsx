import Banner from "@/components/Banner";
import ShortKeyList from "@/components/ShortKeyList";
import MovieList from "@/components/MovieList";
import ProfessionalList from "@/components/ProfessionalList";

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
