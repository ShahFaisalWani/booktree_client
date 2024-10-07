// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addItem, popItem, removeItem } from "../../redux/cartSlice";
// import CircularProgress from "@mui/material/CircularProgress";
// import DeleteIcon from "@mui/icons-material/Delete";

// const CartCard = ({ cartItem }) => {
//   const dispatch = useDispatch();
//   const QuantityBtn = () => {
//     const handleAddItem = () => {
//       dispatch(addItem({ ...cartItem, type: "single" }));
//     };

//     const handleRemoveItem = () => {
//       dispatch(removeItem(cartItem));
//     };

//     return (
//       <div className="flex gap-2 items-center">
//         <button
//           className="flex justify-center items-center w-5 h-5 rounded-[100%] bg-blue-500 text-white"
//           onClick={handleRemoveItem}
//         >
//           -
//         </button>
//         <div className="border border-gray-300 p-2 w-6 h-6 flex justify-center items-center">
//           <p>{cartItem.quantity}</p>
//         </div>

//         <button
//           className="flex justify-center items-center w-5 h-5 rounded-[100%] bg-blue-500 text-white"
//           onClick={handleAddItem}
//         >
//           +
//         </button>
//       </div>
//     );
//   };

//   const [loading, setLoading] = useState(
//     cartItem?.book?.cover_img ? true : false
//   );

//   const handlePopItem = () => {
//     dispatch(popItem(cartItem));
//   };

//   const uid = cartItem?.cover_img?.split("=")[1];
//   const url = `https://drive.google.com/thumbnail?id=${uid}&sz=w1000`;
//   console.log(url);
//   return (
//     <div className="flex mb-4">
//       <div className="w-[40%] max-h-32 flex gap-4">
//         <div className="h-32 w-28">
//           {cartItem?.cover_img ? (
//             <>
//               <img
//                 src={url}
//                 className="h-full w-full object-cover"
//                 onLoad={() => {
//                   setLoading(false);
//                 }}
//               />
//               {loading && (
//                 <div className="h-full w-full flex justify-center items-center">
//                   <CircularProgress
//                     style={{
//                       display: "block",
//                       color: "gray",
//                     }}
//                   />
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="h-full w-full text-xs m-auto flex justify-center items-center border">
//               no image
//             </div>
//           )}
//         </div>
//         <div className="flex flex-col justify-evenly w-72">
//           <p className="text-md tracking-widest font-bold ">
//             {cartItem?.title?.length > 60
//               ? cartItem?.title?.substring(0, 60) + "..."
//               : cartItem.title}
//           </p>
//           <p className="text-xs text-gray-500">{cartItem.author}</p>
//           <p className="text-xs text-gray-500">{cartItem.genre}</p>
//         </div>
//       </div>

//       <div className="w-[50%] flex items-center gap-4">
//         <div className="w-1/4 flex justify-center">
//           <QuantityBtn />
//         </div>
//         <div className="w-1/4 flex justify-center">
//           <p>{cartItem.price} บาท</p>
//         </div>
//         <div className="w-1/4 flex justify-center">
//           <p>{(cartItem.discount * cartItem.quantity).toFixed(2)} บาท</p>
//         </div>
//         <div className="w-1/4 flex justify-center">
//           <p>
//             {(
//               (cartItem.price - cartItem.discount.toFixed(2)) *
//               cartItem.quantity
//             ).toFixed(2)}{" "}
//             บาท
//           </p>
//         </div>
//       </div>
//       <div className="text-red-500 w-[10%] flex items-center justify-center">
//         <button className="" onClick={handlePopItem}>
//           <DeleteIcon />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartCard;
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem, popItem, removeItem } from "../../redux/cartSlice";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import { validateDiscount, calculateFinalPrice } from "../../utils/pricing";

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

  const [loading, setLoading] = useState(cartItem?.cover_img ? true : false);

  const handlePopItem = () => {
    dispatch(popItem(cartItem));
  };

  const uid = cartItem?.cover_img?.split("=")[1];
  const url = `https://drive.google.com/thumbnail?id=${uid}&sz=w1000`;

  const calcNetTotal = () => {
    return (cartItem.price - cartItem.discount) * cartItem.quantity;
  };

  return (
    <div className="flex mb-4">
      <div className="w-[40%] max-h-32 flex gap-4">
        <div className="h-32 w-28">
          {cartItem?.cover_img ? (
            <>
              <img
                src={url}
                className="h-full w-full object-cover"
                onLoad={() => {
                  setLoading(false);
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
            </>
          ) : (
            <div className="h-full w-full text-xs m-auto flex justify-center items-center border">
              no image
            </div>
          )}
        </div>
        <div className="flex flex-col justify-evenly w-72">
          <p className="text-md tracking-widest font-bold ">
            {cartItem?.title?.length > 60
              ? cartItem?.title?.substring(0, 60) + "..."
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
          <p>{calcNetTotal().toFixed(2)} บาท</p>
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
