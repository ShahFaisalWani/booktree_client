import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";
import { toast } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import BookModal from "./BookModal";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItem(book));
  };

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const toggleModal = (value) => {
    setOpen(value);
  };

  return (
    <div className="BookCard w-[150px] sm:w-[200px] md:w-[250px] cursor-pointer">
      <div
        onClick={() => setOpen(true)}
        className="sm:mb-4 sm:px-8 py-6 sm:bg-gray-200 rounded-md hover:shadow-xl transition-all"
      >
        <div
          className="h-full w-36 m-auto shadow-lg sm:shadow-none"
          style={{
            boxShadow:
              window.innerWidth < 640 ? "" : "-10px 5px 10px 2px #00000066",
          }}
        >
          {book.cover_img ? (
            <>
              <img
                src={book?.cover_img}
                className="h-56 w-full object-cover"
                onLoad={() => {
                  setLoading(false);
                }}
                style={{
                  display: loading ? "none" : "block",
                }}
              />
              {loading && (
                <div className="h-56 w-full flex justify-center items-center">
                  <CircularProgress
                    style={{
                      display: "block",
                      color: "gray",
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="h-56 w-full flex justify-center items-center">
              no image
            </div>
          )}
        </div>
      </div>
      <div className="mb-2 flex justify-between">
        <p className="text-sm font-bold">
          {book?.title?.length > (window.innerWidth < 640 ? 18 : 30)
            ? book?.title?.substring(0, window.innerWidth < 640 ? 15 : 27) +
              "..."
            : book?.title}
        </p>
      </div>
      <div className="mb-2 flex justify-between items-center">
        <p className="text-sm font-bold text-green-500">{book?.price} บาท</p>
        {/* <p className="text-xs text-gray-500">
          {book?.author?.length > 15
            ? book?.author?.substring(0, 15) + "..."
            : book?.author}
        </p> */}
        <button
          onClick={handleAddToCart}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xs px-4 py-2 text-center"
        >
          เพิ่ม +
        </button>
      </div>
      <BookModal open={open} toggleModal={toggleModal} book={book} />
    </div>
  );
};

export default BookCard;
