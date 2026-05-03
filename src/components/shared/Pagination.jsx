import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      
      {/* Previous */}
      <button
        disabled={currentPage <= 1}
        onClick={handlePrev}
        className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Info */}
      <span className="font-semibold text-sm text-gray-700">
        Page {currentPage} of {totalPages || 1}
      </span>

      {/* Next */}
      <button
        disabled={currentPage >= totalPages}
        onClick={handleNext}
        className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>

    </div>
  );
};