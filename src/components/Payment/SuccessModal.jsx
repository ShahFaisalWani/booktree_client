import React from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const SuccessModal = ({ orderId, cart }) => {
  const shipping_ls = localStorage.getItem("shipping");
  const shipping = shipping_ls && JSON.parse(shipping_ls);
  return (
    <div className="h-full">
      <div className="h-fit  bg-[#66d15e] p-4">
        <div className="text-center">
          <TaskAltIcon
            sx={{ color: "white", fontSize: "11em", opacity: "50%" }}
          />
          <p className="text-lg sm:text-3xl mt-3">
            ขอบคุณสำหรับสำสั่งซื้ออย่างยิ่ง
          </p>
          <p className="text-xs sm:text-lg mt-2 flex flex-col">
            <span>
              หมายเลขคำสั่งซื้อของคุณ: <b>{orderId}</b>
            </span>
            <span>
              เราจะส่งอีเมลคอนเฟิร์มคำสั่งซื้อ{" "}
              {shipping.label == "รับที่ร้าน"
                ? "และท่านสามารถเข้ามารับได้ที่ร้าน Booktree"
                : "และหลังจากที่เราจัดส่งเรียบร้อยเราจะแจ้งข้อมูลการจัดส่งไปยังอีเมลของท่าน"}
            </span>
          </p>
        </div>
      </div>
      <div>
        <div className="h-fit max-h-2/3  bg-white text-[10px] sm:text-lg p-2 sm:p-8 sm:px-16">
          <p className="mb-2 sm:mb-4">รายการสั่งซื้อ: </p>
          <div className="max-h-[300px] overflow-y-scroll text-[10px] sm:text-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-[1px] w-[35%] border-black text-left p-1 sm:p-[8px]">
                    ISBN
                  </th>
                  <th className="border-[1px] w-[40%] border-black text-left p-1 sm:p-[8px]">
                    ชื่อสินค้า
                  </th>
                  <th className="border-[1px] w-[15%] border-black text-left p-1 sm:p-[8px]">
                    ราคา
                  </th>
                  <th className="border-[1px] w-[10%] border-black text-left p-1 sm:p-[8px]">
                    จำนวน
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cart).map((i) => (
                  <tr key={i}>
                    <td className="border-[1px] w-[35%] border-black text-left p-1 sm:p-[8px]">
                      {cart[i].ISBN}
                    </td>
                    <td className="border-[1px] w-[40%] border-black text-left p-1 sm:p-[8px]">
                      {cart[i].title}
                    </td>
                    <td className="border-[1px] w-[15%] border-black text-left p-1 sm:p-[8px]">
                      {cart[i].price}
                    </td>
                    <td className="border-[1px] w-[10%] border-black text-left p-1 sm:p-[8px]">
                      {cart[i].quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
