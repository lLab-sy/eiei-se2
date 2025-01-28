export default function PaginationBar({postListLenght,projectsPerPage,setCurrentPage,currentPage}:{postListLenght:number,projectsPerPage:number,setCurrentPage:Function,currentPage:number}){
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
      const paginationPages: number[] = Array.from( //page number that need to show
        { length: paginationEnd - paginationStart + 1 },
        (_, i) => paginationStart + i
    );
    return(
      
            <div className="flex justify-center items-center mt-4 space-x-2">
            {/* Previous Arrow */}
            <button
            className={`px-4 py-2 rounded-full my-3 ${
                currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-sky-700"
            }`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
            >
            &larr; Prev
            </button>
        
            {/* Page Numbers */}
            {paginationPages.map((page) => (
            <button
                key={page}
                className={`px-4 py-2 rounded-full my-3 ${
                page === currentPage
                    ? "bg-gray-700 text-white"
                    : "bg-gray-300 text-black hover:bg-sky-700"
                }`}
                onClick={() => handlePageClick(page)}
            >
                {page}
            </button>
            ))}
        
            {/* Next Arrow */}
            <button
            className={`px-4 py-2 rounded-full my-3 ${
                currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-sky-700"
            }`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
            >
            Next &rarr;
            </button>
        </div>
        
    )
}