import React, { useEffect, useState, useContext } from "react";
import { FormContext } from "../../pages/Checkout";
import { useDispatch, useSelector } from "react-redux";
import {
  getTotalItems,
  getTotalPrice,
  getTotalDiscount,
  applyDiscount,
} from "../../redux/cartSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import LoadingScreen from "../Loading/LoadingScreen";
import {
  CircularProgress,
  FormControl,
  Input,
  InputAdornment,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const shippingMethods = [
  { label: "Flash", price: 50 },
  { label: "รับที่ร้าน", price: 0 },
];

const OrderSummary = () => {
  const totalItems = useSelector(getTotalItems);
  const totalPrice = useSelector(getTotalPrice);
  const totalDiscount = useSelector(getTotalDiscount);

  const dispatch = useDispatch();
  const {
    activeStepIndex,
    setActiveStepIndex,
    setIsSubmitted,
    setIsPressed,
    paymentLoading,
  } = useContext(FormContext);

  const handleNext = () => {
    if (activeStepIndex == 0) {
      if (shippingFee.price == 0) setActiveStepIndex(activeStepIndex + 2);
      else setActiveStepIndex(activeStepIndex + 1);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else if (activeStepIndex == 1) {
      setIsSubmitted(true);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else {
      setIsPressed(true);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const mmID =
    sessionStorage.getItem("memberId") &&
    JSON.parse(sessionStorage.getItem("memberId"));
  const [memberId, setMemberId] = useState(mmID || "");

  const isMM =
    sessionStorage.getItem("isMember") &&
    JSON.parse(sessionStorage.getItem("isMember"));
  const [isMember, setIsMember] = useState(isMM || "none");
  const [shippingFee, setShippingFee] = useState(shippingMethods[0]);
  const [netTotal, setNetTotal] = useState(0);
  const [shippingDiscount, setShippingDiscount] = useState(0);

  const calcTotal = () => {
    if (shippingFee.price != 0) {
      if (totalPrice - totalDiscount + shippingFee.price >= 650) {
        setShippingDiscount(50);
      } else {
        setShippingDiscount(0);
      }
    } else {
      setShippingDiscount(0);
    }
    setNetTotal(
      (
        totalPrice -
        totalDiscount +
        shippingFee.price -
        shippingDiscount
      ).toFixed(2)
    );
  };

  useEffect(() => {
    calcTotal();
    localStorage.setItem(
      "shipping",
      JSON.stringify({ ...shippingFee, discount: shippingDiscount })
    );
  }, [totalPrice, totalDiscount, shippingFee, shippingDiscount]);

  const handleChange = (e) => {
    setShippingFee(e.target.value);
    calcTotal();
  };

  const checkMember = async () => {
    if (memberId && totalItems > 0) {
      setIsLoading(true);
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_BASEURL + "/member/check/" + memberId
        );
        if (res.data.status == "valid") {
          toast.success("Discounts applied");
          dispatch(applyDiscount());
          calcTotal();
          setIsMember(true);
          sessionStorage.setItem("memberId", JSON.stringify(memberId));
          sessionStorage.setItem("isMember", JSON.stringify(true));
          window.location.reload();
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.message || "Error occured");
        setIsMember(false);
        sessionStorage.setItem("memberId", JSON.stringify(""));
        sessionStorage.setItem("isMember", JSON.stringify(isMember));

        setIsLoading(false);
      }
    }
  };

  return (
    <div className="text-center bg-gray-200 pt-4 w-96">
      <div className="pb-4 border-b-2 border-gray-300">
        <p className="text-2xl">สรุปรายการสั่งซื้อ</p>
      </div>
      <div className="my-4 py-4 border-b-2 border-gray-300">
        <div className="mb-4">
          <p className="text-red-500 text-sm mb-3">
            *ส่งฟรีเมื่อซื้อขั้นต่ำ 600 บาท
          </p>
          <FormControl disabled={activeStepIndex == 0 ? false : true}>
            <InputLabel id="demo-simple-select-label">จัดส่ง</InputLabel>
            <Select
              className="w-56"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Shipping"
              value={shippingFee}
              onChange={handleChange}
            >
              {shippingMethods.map((item, i) => (
                <MenuItem key={i} value={item}>
                  {item.label} - {item.price} บาท
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="px-8 py-4">
          <div className="flex justify-evenly mb-2">
            <Input
              type="text"
              variant="outlined"
              name="member_id"
              placeholder="รหัสสมาชิก"
              className="rounded-2xl border-4"
              onChange={(e) => setMemberId(e.target.value)}
              disabled={isMember == true}
              value={memberId}
              endAdornment={
                <InputAdornment position="end">
                  {isMember === "none" ? (
                    <button
                      onClick={checkMember}
                      className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs w-full sm:w-auto p-2 text-center"
                    >
                      ยืนยัน
                    </button>
                  ) : (
                    <>
                      {isMember ? (
                        <CheckIcon sx={{ color: "green" }} />
                      ) : (
                        <button
                          onClick={checkMember}
                          className={`${isLoading && "animate-spin"}`}
                        >
                          <RefreshIcon sx={{ color: "blue" }} />
                        </button>
                      )}
                    </>
                  )}
                </InputAdornment>
              }
            />
          </div>
          <Link
            to={"/user/member"}
            target="_blank"
            className="pb-4 text-sm text-blue-700"
          >
            ไม่มีสมาชิก? สมัครเลยเพื่อส่วนลด
          </Link>
        </div>
      </div>
      <div className="pb-4 mb-4 flex flex-col gap-1 border-b-2 border-gray-300">
        <div className="flex justify-between px-8">
          <p>จำนวมทั้งสิ้น: </p>
          <p>{totalItems} ชิ้น</p>
        </div>
        <div className="flex justify-between px-8">
          <p>ราคารวม: </p>
          <p>{totalPrice?.toFixed(2)} บาท</p>
        </div>
        <div className="flex justify-between px-8">
          <p>ส่วนลด: </p>
          <p className="text-red-500">-{totalDiscount?.toFixed(2)} บาท</p>
        </div>
        <div className="flex justify-between px-8">
          <p>ราคาค่าส่ง: </p>
          <p>{shippingFee?.price?.toFixed(2)} บาท</p>
        </div>
        <div className="flex justify-between px-8">
          <p>ส่วนลดค่าส่ง: </p>
          <p className="text-red-500">-{shippingDiscount?.toFixed(2)} บาท</p>
        </div>
        <div className="flex justify-between px-8">
          <p>ราคาสุทธิ: </p>
          <p>{netTotal} บาท</p>
        </div>
      </div>
      {Boolean(totalItems) && (
        <div className="pb-4">
          <button
            type="submit"
            className="m-auto w-full min-w-[25%] flex justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
            onClick={handleNext}
          >
            {(() => {
              switch (activeStepIndex) {
                case 0:
                  return (
                    <>
                      ต่อไป <NavigateNextIcon />
                    </>
                  );
                case 1:
                  return (
                    <>
                      เลือกวิธีการชำระเงิน <NavigateNextIcon />
                    </>
                  );
                default:
                  return (
                    <>
                      {paymentLoading ? (
                        <CircularProgress
                          style={{
                            color: "white",
                          }}
                          size={20}
                        />
                      ) : (
                        "ชำระเงิน"
                      )}
                    </>
                  );
              }
            })()}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
