import React from "react";
import { useSelector } from "react-redux";
import CartCard from "../../components/Cart/CartCard";
import CartCardMobile from "./CartCardMobile";

const CartDisplay = () => {
  const cart = useSelector((state) => state.cart.items);

  const Header = () => {
    return (
      <div className="flex mb-4">
        <div className="w-[40%] max-h-28 gap-4">
          <p>รายละเอียดสินค้า</p>
        </div>
        <div className="w-[50%] flex gap-4">
          <div className="w-1/4 flex items-center justify-center">
            <p>จำนวน</p>
          </div>
          <div className="w-1/4 flex items-center justify-center">
            <p>ราคา</p>
          </div>
          <div className="w-1/4 flex items-center justify-center">
            <p>ส่วนลด</p>
          </div>
          <div className="w-1/4 flex items-center justify-center">
            <p>รวม</p>
          </div>
        </div>
        <div className="w-[10%]"></div>
      </div>
    );
  };
  return (
    <div>
      <h2 className="font-light pb-4 mb-8 border-b-2 border-gray-300">
        รายการสินค้า
      </h2>
      <div className="px-8 hidden sm:block">
        <Header />
      </div>
      <div className="mb-4 py-4 border-b-2 border-gray-300  h-[40vh] overflow-scroll">
        {Object.values(cart).length ? (
          Object.values(cart).map((item, i) => (
            <div key={i}>
              <div className="hidden sm:block px-8">
                <CartCard cartItem={item} />
              </div>
              <div className="block sm:hidden">
                <CartCardMobile cartItem={item} />
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-start border-b-2 border-t-2 py-8 mt-10 text-xl">
            ไม่มีสินค้าในตะกล้า
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDisplay;
