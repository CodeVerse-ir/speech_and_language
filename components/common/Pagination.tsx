"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface PaginationProps {
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") || 1)
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    setCurrentPage(page);

    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());

    router.replace(`${pathname}?${params}`);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 mx-1 rounded text-sm sm:text-base ${
              currentPage === i
                ? "bg-orange-400 text-white"
                : "bg-orange-200 hover:bg-orange-300 transition-colors duration-150"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      if (currentPage <= maxVisiblePages) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pageNumbers.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 mx-1 rounded text-sm sm:text-base ${
                currentPage === i
                  ? "bg-orange-400 text-white"
                  : "bg-orange-200 hover:bg-orange-300 transition-colors duration-150"
              }`}
            >
              {i}
            </button>
          );
        }

        pageNumbers.push(
          <span
            key="ellipsis"
            className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 mx-1"
          >
            ...
          </span>
        );
        pageNumbers.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 mx-1 rounded text-sm sm:text-base ${
              currentPage === totalPages
                ? "bg-orange-400 text-white"
                : "bg-orange-200 hover:bg-orange-300 transition-colors duration-150"
            }`}
          >
            {totalPages}
          </button>
        );
      } else {
        pageNumbers.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 mx-1 rounded text-sm sm:text-base ${
              currentPage === 1
                ? "bg-orange-400 text-white"
                : "bg-orange-200 hover:bg-orange-300 transition-colors duration-150"
            }`}
          >
            1
          </button>
        );

        pageNumbers.push(
          <span
            key="ellipsis"
            className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 mx-1"
          >
            ...
          </span>
        );

        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pageNumbers.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 mx-1 rounded text-sm sm:text-base ${
                currentPage === i
                  ? "bg-orange-400 text-white"
                  : "bg-orange-200 hover:bg-orange-300 transition-colors duration-150"
              }`}
            >
              {i}
            </button>
          );
        }
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 mx-1 bg-orange-200 rounded hover:bg-orange-300 disabled:opacity-50 text-sm sm:text-base"
      >
        قبلی
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 mx-1 bg-orange-200 rounded hover:bg-orange-300 disabled:opacity-50 text-sm sm:text-base"
      >
        بعدی
      </button>
    </div>
  );
};

export default Pagination;
