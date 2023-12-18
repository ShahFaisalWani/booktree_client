import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import SortButton from "./SortButton";
import StationeryCard from "./StationeryCard";

const limit = window.innerWidth < 640 ? 20 : 25;

const BooksDisplay = ({
  books,
  page,
  handlePageChange,
  pages,
  totalCount,
  show,
}) => {
  const path = window.location.pathname;
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
      <div className="flex justify-around items-center my-4 sm:mb-8 sm:px-20">
        <div>
          <p className="hidden sm:block">
            แสดง {from} ถึง {to} จาก {totalCount} รายการ
          </p>
          <div className="block sm:hidden">
            {path.split("/")[2] !== null &&
            path.split("/")[2] !== undefined &&
            path.split("/")[2] !== "topsales" ? (
              <p className="w-screen flex justify-center">
                แสดง {from} ถึง {to} จาก {totalCount} รายการ
              </p>
            ) : (
              <div className="">
                <p>
                  แสดง {from} ถึง {to}
                </p>
                <p>จาก {totalCount} รายการ</p>
              </div>
            )}
          </div>
        </div>
        <div>{show == "no" ? null : <SortButton />}</div>
      </div>
      <div className="mb-16">
        <div className="grid sm:gap-y-10 justify-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
          size={window.innerWidth < 640 ? "small" : "large"}
          boundaryCount={window.innerWidth < 640 ? 1 : 1} // Shows the first and last number
          siblingCount={window.innerWidth < 640 ? 1 : 3}
          renderItem={(item) => (
            <PaginationItem
              components={{
                next: () => (
                  <div>
                    <div className="text-sm items-center hidden sm:flex">
                      ต่อไป <NavigateNextIcon />
                    </div>
                    <div className=" block sm:hidden">
                      <NavigateNextIcon />
                    </div>
                  </div>
                ),
                previous: () => (
                  <div>
                    <div className="text-sm items-center hidden sm:flex">
                      <NavigateBeforeIcon />
                      ย้อนกลับ
                    </div>
                    <div className=" block sm:hidden">
                      <NavigateBeforeIcon />
                    </div>
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
