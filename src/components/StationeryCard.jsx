import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";
import { toast } from "react-hot-toast";

const StationeryCard = ({ item }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const handleAddToCart = () => {
    dispatch(addItem(item));
  };

  return (
    <>
      <div className="BookCard w-56 cursor-pointer">
        <div className="mb-4 px-8 py-6 bg-gray-200 rounded-md hover:shadow-xl transition-all">
          <div
            className="h-full"
            style={{ boxShadow: "-10px 5px 10px 2px #00000066" }}
          >
            <img
              src={item.cover_img}
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
          </div>
        </div>
        <div className="flex flex-col ">
          <div className="mb-2 w-full flex">
            <p className="text-sm font w-full font-bold ">
              {item.title.length > 25
                ? item.title.substring(0, 25) + "..."
                : item.title}
            </p>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <p className="w-1/2 text-sm font-bold text-green-500">
              {item.price} บาท
            </p>
            <button
              onClick={handleAddToCart}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xs px-4 py-2 text-center"
            >
              + เพิ่ม
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StationeryCard;
