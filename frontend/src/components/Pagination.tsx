import { FC, JSX } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page: number) => {
        onPageChange(page);
        window.scrollTo({ top: 0 }); // Scroll to top of the page
    };

    const renderPageNumbers = () => {
        const pageNumbers: JSX.Element[] = [];
        for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
            pageNumbers.push(
            <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-3 py-1 mx-1 text-sm rounded-full ${i === currentPage ? "bg-mainblue-light text-white" : "text-gray-600 hover:bg-gray-200"}`}
            >
                {i}
            </button>
            );
        } else if (
            (i === currentPage - 3 || i === currentPage + 3) &&
            !pageNumbers.includes(<span key={`dots-${i}`} className="mx-1">...</span>)
        ) {
            pageNumbers.push(
            <span key={`dots-${i}`} className="mx-1 text-gray-500">...</span>
            );
        }
        }
        return pageNumbers;
    };

    return (
        <div className="flex justify-center items-center mt-8">
        <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-200 disabled:text-gray-200 disabled:cursor-not-allowed"
        >
            <ChevronLeft size={20} color="#1D4ED8"/>
        </button>
        {renderPageNumbers()}
        <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-200 disabled:text-gray-200 disabled:cursor-not-allowed"
        >
            <ChevronRight size={20} color="#1D4ED8"/>
        </button>
        </div>
    );
};

export default Pagination;
