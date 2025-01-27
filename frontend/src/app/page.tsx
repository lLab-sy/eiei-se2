import NavBar from "@/components/NavBar";
import Banner from "@/components/Banner";
import ShortKeyList from "@/components/ShortKeyList";
import MovieList from "@/components/MovieList";
import ProfessionalList from "@/components/ProfessionalList";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Banner />
      <ShortKeyList />
      <MovieList />
      <ProfessionalList />
      <Footer />
    </div>
  );
}
