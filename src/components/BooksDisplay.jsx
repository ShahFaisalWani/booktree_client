import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import SortButton from "./SortButton";
import StationeryCard from "./StationeryCard";

const limit = 25;

const BooksDisplay = ({
  books,
  page,
  handlePageChange,
  pages,
  totalCount,
  show,
}) => {
  const [booksArray, setBooksArray] = useState(books);
  useEffect(() => {
    setBooksArray(books);
  }, [books]);

  const handleChange = (event, value) => {
    handlePageChange(value);
  };

  const handleSort = (type) => {
    // handleSortChange(type);
  };

  const from = books?.length > 0 ? (page - 1) * limit + 1 : 0;
  const to =
    books.length == limit
      ? totalCount - (totalCount - page * books.length)
      : totalCount;

  return (
    <div className="">
      <div className="flex justify-between mb-8 px-20">
        <div>
          <p className="">
            แสดง {from} ถึง {to} จาก {totalCount} รายการ
          </p>
        </div>
        <div>{show == "no" ? null : <SortButton />}</div>
      </div>
      <div className="mb-16">
        <div className="grid gap-y-10 justify-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {booksArray.map((book, i) => (
            <BookCard book={book} key={i} />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Pagination
          page={page}
          count={pages}
          onChange={handleChange}
          size="large"
          boundaryCount={1} // Shows the first and last number
          siblingCount={3}
          renderItem={(item) => (
            <PaginationItem
              components={{
                next: () => (
                  <div className="text-sm flex items-center">
                    ต่อไป <NavigateNextIcon />
                  </div>
                ),
                previous: () => (
                  <div className="text-sm flex items-center">
                    <NavigateBeforeIcon />
                    ย้อนกลับ
                  </div>
                ),
              }}
              {...item}
            />
          )}
          style={{
            border: "1px solid #eee",
            borderRadius: "20px",
            padding: "5px 0px",
          }}
        />
      </div>
    </div>
  );
};

export default BooksDisplay;
