"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginationButtonsProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function PaginationButtons({
  pagination,
  onPageChange,
  isLoading = false,
}: PaginationButtonsProps) {
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Add ellipsis if current page is > 3
      if (currentPage > 3) {
        pageNumbers.push("ellipsis");
      }

      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if current page is < totalPages - 2
      if (currentPage < totalPages - 2) {
        pageNumbers.push("ellipsis");
      }

      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (pagination.hasPrevPage && !isLoading) {
                onPageChange(pagination.currentPage - 1);
              }
            }}
            className={
              !pagination.hasPrevPage || isLoading
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => !isLoading && onPageChange(page as number)}
                isActive={page === pagination.currentPage}
                className={isLoading ? "pointer-events-none" : "cursor-pointer"}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (pagination.hasNextPage && !isLoading) {
                onPageChange(pagination.currentPage + 1);
              }
            }}
            className={
              !pagination.hasNextPage || isLoading
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
