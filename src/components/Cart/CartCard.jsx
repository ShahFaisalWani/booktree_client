import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem, popItem, removeItem } from "../../redux/cartSlice";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";

const CartCard = ({ cartItem }) => {
  const dispatch = useDispatch();
  const QuantityBtn = () => {
    const handleAddItem = () => {
      dispatch(addItem({ ...cartItem, type: "single" }));
    };

    const handleRemoveItem = () => {
      dispatch(removeItem(cartItem));
    };

    return (
      <div className="flex gap-2 items-center">
        <button
          className="flex justify-center items-center w-5 h-5 rounded-[100%] bg-blue-500 text-white"
          onClick={handleRemoveItem}
        >
          -
        </button>
        <div className="border border-gray-300 p-2 w-6 h-6 flex justify-center items-center">
          <p>{cartItem.quantity}</p>
        </div>

        <button
          className="flex justify-center items-center w-5 h-5 rounded-[100%] bg-blue-500 text-white"
          onClick={handleAddItem}
        >
          +
        </button>
      </div>
    );
  };

  const [loading, setLoading] = useState(true);

  const handlePopItem = () => {
    dispatch(popItem(cartItem));
  };

  return (
    <div className="flex mb-4">
      <div className="w-[40%] max-h-32 flex gap-4">
        <div className="h-32 w-28">
          <img
            src={cartItem.cover_img}
            className="h-full w-full object-cover"
            onLoad={() => {
              setLoading(false);
            }}
            style={{
              display: loading ? "none" : "block",
            }}
          />
          {loading && (
            <div className="h-full w-full flex justify-center items-center">
              <CircularProgress
                style={{
                  display: "block",
                  color: "gray",
                }}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-evenly w-72">
          <p className="text-md tracking-widest font-bold ">
            {cartItem.title.length > 60
              ? cartItem.title.substring(0, 60) + "..."
              : cartItem.title}
          </p>
          <p className="text-xs text-gray-500">{cartItem.author}</p>
          <p className="text-xs text-gray-500">{cartItem.genre}</p>
        </div>
      </div>

      <div className="w-[50%] flex items-center gap-4">
        <div className="w-1/4 flex justify-center">
          <QuantityBtn />
        </div>
        <div className="w-1/4 flex justify-center">
          <p>{cartItem.price} บาท</p>
        </div>
        <div className="w-1/4 flex justify-center">
          <p>{(cartItem.discount * cartItem.quantity).toFixed(2)} บาท</p>
        </div>
        <div className="w-1/4 flex justify-center">
          <p>
            {(
              (cartItem.price - cartItem.discount.toFixed(2)) *
              cartItem.quantity
            ).toFixed(2)}{" "}
            บาท
          </p>
        </div>
      </div>
      <div className="text-red-500 w-[10%] flex items-center justify-center">
        <button className="" onClick={handlePopItem}>
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default CartCard;
