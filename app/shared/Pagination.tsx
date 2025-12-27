"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 py-4">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className="p-3 rounded-lg bg-[#F2F2F2] hover:bg-gray-200"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`py-3 px-4 rounded-lg ${
            currentPage === page
              ? "bg-orange-500 text-white"
              : "bg-[#F2F2F2] hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        className="p-3 rounded-lg bg-[#F2F2F2] hover:bg-gray-200"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
