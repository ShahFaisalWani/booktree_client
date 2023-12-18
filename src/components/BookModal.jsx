import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cartSlice";
import { toast } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "85vh",
  bgcolor: "background.paper",
  boxShadow: 24,
};

export default function BookModal({ open, toggleModal, book }) {
  const cart = useSelector((state) => state.cart.items);

  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!book.desc) {
      setContent(
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam alias quo cupiditate molestiae. Pariatur repellat perspiciatis impedit similique, facilis error! Error vitae labore quae, eos ipsum odit voluptas praesentium enim magni ab id earum, dolorem voluptatibus porro dolorum, tenetur omnis."
      );
    } else if (book.desc.length > 850 && !isExpanded) {
      setContent(book.desc.substring(0, 850).replace(/\s+/g, " ") + "...");
    } else {
      setContent(book.desc.replace(/\s+/g, " "));
    }
  }, [book.desc, isExpanded]);

  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const handleRemoveItem = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };
  const handleAddItem = () => {
    const cartItem = cart[book.ISBN];
    if (cartItem) {
      if (quantity < book.in_stock - cart[book.ISBN]?.quantity)
        setQuantity((prev) => prev + 1);
    } else setQuantity((prev) => prev + 1);
  };
  const handleAddToCart = () => {
    dispatch(addItem({ ...book, quantity }));
    toggleModal(false);
  };

  const [loading, setLoading] = useState(true);
  return (
    <div>
      <Modal
        open={open}
        onClose={() => toggleModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button
            onClick={() => toggleModal(false)}
            className="absolute right-7 top-7 text-gray-400"
          >
            <CloseIcon fontSize="medium" />
          </button>
          <div className="flex flex-col sm:flex-row h-full">
            <div className="sm:w-1/2 h-[30%] sm:h-full flex">
              {/* <div className="h-full flex items-center"> */}
              <div className="h-full xl:w-full m-auto flex items-center">
                <img
                  src={book.cover_img}
                  className="m-auto h-[80%] sm:h-[80%] object-cover"
                  onLoad={() => {
                    setLoading(false);
                  }}
                  style={{
                    boxShadow: "-10px 5px 10px 2px #00000066",
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
              </div>
            </div>
            <div className="h-fit my-auto sm:w-1/2 px-3 sm:px-0 sm:pr-16  sm:py-12 flex flex-col gap-3 sm:gap-7 text-[0.70rem] sm:text-[1em]">
              <div>
                <p className="text-[1.5em] sm:text-2xl sm:mb-3">{book.title}</p>
                <p>{book.author}</p>
              </div>
              <div className="overflow-y-auto max-h-[30vh] mb-3">
                <p className="text-left">
                  {content}
                  {book.desc && book.desc.length > 800 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="underline text-gray-400"
                    >
                      {isExpanded ? "อ่านน้อยลง" : "อ่านเพิ่มเติม"}
                    </button>
                  )}
                </p>
              </div>
              <div className="flex justify-between">
                <div className="text-lg sm:text-2xl mb-3">
                  <p className="font-bold">{book.price} บาท</p>
                </div>
                {book.in_stock > 0 ? (
                  <div className="flex gap-2 items-center sm:text-2xl">
                    <button
                      className="flex justify-center items-center text-xs sm:text-xl w-4 sm:w-8 h-4 sm:h-8 rounded-[100%] bg-blue-500 text-white"
                      onClick={handleRemoveItem}
                    >
                      -
                    </button>
                    <div className="p-2 w-10 h-10 text-lg sm:text-xl flex justify-center items-center">
                      <p>{quantity}</p>
                    </div>

                    <button
                      className="flex justify-center items-center text-xs sm:text-xl w-4 sm:w-8 h-4 sm:h-8 rounded-[100%] bg-blue-500 text-white"
                      onClick={handleAddItem}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <p>สินค้าหมดสต็อก</p>
                )}
              </div>
              <div className="">
                <button
                  onClick={handleAddToCart}
                  type="button"
                  className={`w-full flex justify-center items-center text-white ${
                    book.in_stock == 0
                      ? "bg-gray-400"
                      : "bg-blue-700 hover:bg-blue-800"
                  } focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full px-2 py-2 sm:py-4`}
                  disabled={book.in_stock == 0}
                >
                  {book.in_stock == 0 ? "หมด" : "เพิ่มลงตะกร้า"}
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
