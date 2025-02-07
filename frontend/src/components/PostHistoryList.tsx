import { useState } from "react";
import { Project } from "../../interface";
import PostHistoryCard from "./PostHistoryCard";
import PaginationBar from "./PostHistoryPaginationBar";
import Link from "next/link";
import { Briefcase, Film } from "lucide-react";

export default function PostHistoryList({
  postLists,
}: {
  postLists: Project[];
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [myRole, setMyRole] = useState<string>("producer");

  const projectsPerPage = 10;
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = postLists.slice(
    startIndex,
    startIndex + projectsPerPage,
  );

  const toggleRole = () => {
    setMyRole((prevRole) =>
      prevRole === "producer" ? "productionProfessional" : "producer",
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <button
              onClick={toggleRole}
              className="group relative inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {myRole === "producer" ? (
                <Briefcase className="w-5 h-5 text-mainblue" />
              ) : (
                <Film className="w-5 h-5 text-mainblue" />
              )}
              <span className="text-mainblue font-medium">
                Viewing as:{" "}
                {myRole === "producer" ? "Producer" : "Production Professional"}
              </span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"></span>
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-mainblue mb-4">
            {myRole === "producer" ? "Project History" : "Work History"}
          </h1>
          <div className="h-1 w-24 bg-mainblue-light mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600">
            {myRole === "producer"
              ? "Explore your creative projects and collaborations"
              : "View your completed projects and achievements"}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {currentProjects.map((project) => (
            <div
              key={project.id}
              className="transform hover:-translate-y-1 transition-transform duration-300"
            >
              <Link href={`/post/${project.id}`}>
                <PostHistoryCard post={project} role={myRole} />
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <PaginationBar
            currentPage={currentPage}
            projectsPerPage={projectsPerPage}
            postListLenght={postLists.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
