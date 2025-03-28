import Banner from "@/components/Banner";
import ShortKeyList from "@/components/ShortKeyList";
import MovieList from "@/components/MovieList";
import ProfessionalList from "@/components/ProfessionalList";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href="https://eiei-sprint-se2.s3.us-east-1.amazonaws.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://eiei-sprint-se2.s3.us-east-1.amazonaws.com"
        />
        <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
            as="style"
            type="text/css"
          />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Banner />
        <ShortKeyList />
        <MovieList />
        <ProfessionalList />
      </div>
    </>
  );
}
