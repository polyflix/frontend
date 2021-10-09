import { useState } from "react";
import { cn } from "../../../common";

type Props = {
  limit?: number;
  totalRecords?: number;
  neighbours?: number;
  onPageChanged?: (page: number) => void;
};

enum Page {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

const range = (from: number, to: number, step = 1) => {
  const _range = [];
  for (let i = from; i <= to; i++) {
    _range.push(i);
  }
  return _range;
};

export const Pagination = ({
  totalRecords = 1,
  limit = 10,
  neighbours = 0,
  onPageChanged,
}: Props) => {
  const totalPages = Math.ceil(totalRecords / limit);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const computePageNumbers = () => {
    // The total page numbers to show in the control
    const totalNumbers = neighbours * 2 + 3;
    // the total numbers + 2 to cover for the left and right controls
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - neighbours);
      const endPage = Math.min(totalPages - 1, currentPage + neighbours);

      let pages: (number | string)[] = range(startPage, endPage);

      // Has hidden pages to the left
      const hasLeftSpill = startPage > 2;
      // Has hidden pages to the right
      const hasRightSpill = totalPages - endPage > 1;
      // Number of hidden pages either to the left or to the right
      const spillOffset = totalNumbers - (pages.length + 1);

      if (hasLeftSpill && !hasRightSpill) {
        const extraPages = range(startPage - spillOffset, startPage - 1);
        pages = [Page.LEFT, ...extraPages, ...pages];
      } else if (!hasLeftSpill && hasRightSpill) {
        const extraPages = range(endPage + 1, endPage + spillOffset);
        pages = [...pages, ...extraPages, Page.RIGHT];
      } else {
        pages = [Page.LEFT, ...pages, Page.RIGHT];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  const goToPage = (page: number) => {
    const currentPage = Math.max(0, Math.min(page, totalPages));
    setCurrentPage(currentPage);
    onPageChanged && onPageChanged(currentPage);
  };

  const handleClick = (page: number) => (event: any) => {
    event.preventDefault();
    goToPage(page);
  };

  const handleMoveLeft = (event: any) => {
    event.preventDefault();
    goToPage(currentPage - neighbours * 2 - 1);
  };

  const handleMoveRight = (event: any) => {
    event.preventDefault();
    goToPage(currentPage + neighbours * 2 + 1);
  };

  const pages = computePageNumbers();

  return (
    <>
      <ul className="flex text-nx-white">
        {pages.map((page, index) => {
          const isFirst = index === 0;
          const isLast = index === pages.length - 1;
          const isActive = currentPage === page;
          const pageItemClasses = cn(
            "border border-opacity-20 border-lightgray p-2 min-w-pagination flex items-center transition-all justify-center cursor-pointer",
            isFirst && "rounded-l-md",
            isLast && "rounded-r-md",
            isActive ? "bg-nx-red" : "bg-darkgray"
          );

          if (page === Page.LEFT)
            return (
              <li
                onClick={handleMoveLeft}
                key={index}
                className={pageItemClasses}
              >
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </li>
            );

          if (page === Page.RIGHT)
            return (
              <li
                onClick={handleMoveRight}
                key={index}
                className={pageItemClasses}
              >
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </li>
            );

          return (
            <li
              onClick={handleClick(page as number)}
              key={index}
              className={pageItemClasses}
            >
              {page}
            </li>
          );
        })}
      </ul>
    </>
  );
};
