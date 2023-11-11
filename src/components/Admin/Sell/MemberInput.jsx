import { useContext, useState } from "react";
import { Input, InputAdornment } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";
import toast from "react-hot-toast";
import axios from "axios";
import { SellContext } from "./SellBooks";

const MemberInput = () => {
  const { cart, setCart, member, setMember, memberId, setMemberId } =
    useContext(SellContext);

  const setCartFunc = (data) => {
    setCart(data);
    localStorage.setItem("sellCart", JSON.stringify(data));
  };

  const checkMember = async (e) => {
    e.preventDefault();
    if (memberId) {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_BASEURL + "/member/check/" + memberId
        );

        if (res.data.status === "valid") {
          setMember(true);
          const newData = cart.map((book) => {
            if (book.author) {
              return {
                ...book,
                discount: Math.ceil(book.price * 0.05),
                price: Math.floor(book.price),
              };
            } else {
              return { ...book };
            }
          });
          setCartFunc(newData);
          toast.success("ส่วนลดสำเร็จ");
        } else {
          setMember(false);
          toast.error("หมายเลขสมาชิกนี้หมดอายุแล้ว");
        }
      } catch (err) {
        setMember(false);
        toast.error("ไม่มีหมายเลขสมาชิกนี้");
      }
    }
  };

  return (
    <div className="flex justify-evenly">
      <Input
        type="text"
        variant="outlined"
        name="member_id"
        placeholder="เบอร์โทร"
        className="rounded-2xl px-2 py-1"
        onChange={(e) => setMemberId(e.target.value)}
        disabled={member == true}
        value={memberId}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            checkMember(e);
          }
        }}
        endAdornment={
          <InputAdornment position="end">
            {member === "none" ? (
              <button
                onClick={checkMember}
                className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs w-full sm:w-auto p-2 text-center"
              >
                ยืนยัน
              </button>
            ) : (
              <>
                {member ? (
                  <CheckIcon sx={{ color: "green" }} />
                ) : (
                  <button onClick={checkMember}>
                    <RefreshIcon sx={{ color: "blue" }} />
                  </button>
                )}
              </>
            )}
          </InputAdornment>
        }
      />
    </div>
  );
};

export default MemberInput;
