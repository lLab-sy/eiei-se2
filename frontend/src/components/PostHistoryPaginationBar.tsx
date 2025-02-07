export default function PaginationBar({
  postListLenght,
  projectsPerPage,
  setCurrentPage,
  currentPage,
}: {
  postListLenght: number;
  projectsPerPage: number;
  setCurrentPage: Function;
  currentPage: number;
}) {
  const pagesToShow = 3;
  const totalPages = Math.ceil(postListLenght / projectsPerPage);
  const handlePageClick = (page: number): void => {
    setCurrentPage(page);
  };

  const handlePrevious = (): void => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = (): void => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const paginationStart = Math.max(1, currentPage - 1);
  const paginationEnd = Math.min(totalPages, paginationStart + pagesToShow - 1);
  const paginationPages: number[] = Array.from(
    //page number that need to show
    { length: paginationEnd - paginationStart + 1 },
    (_, i) => paginationStart + i,
  );
  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        className={`px-6 py-2 rounded-full transition-all duration-200 flex items-center
          ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-mainblue text-white hover:bg-mainblue-light"
          }`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <span className="mr-1">←</span> Prev
      </button>

      {paginationPages.map((page) => (
        <button
          key={page}
          className={`w-10 h-10 rounded-full transition-all duration-200
            ${
              page === currentPage
                ? "bg-mainblue text-white"
                : "bg-gray-100 text-gray-700 hover:bg-mainblue hover:text-white"
            }`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={`px-6 py-2 rounded-full transition-all duration-200 flex items-center
          ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-mainblue text-white hover:bg-mainblue-light"
          }`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next <span className="ml-1">→</span>
      </button>
    </div>
  );
}
