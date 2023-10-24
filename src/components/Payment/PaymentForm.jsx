import React, { useState, useContext, useRef } from "react";
import PaymentBtn from "./PaymentBtn";
import { FormContext } from "../../pages/Checkout";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState(0);

  const { activeStepIndex, setActiveStepIndex } = useContext(FormContext);

  const handleChange = () => {
    setPaymentMethod(1);
  };

  const handlePrev = () => {
    const shipping = localStorage.getItem("shipping");
    const shippingFee = shipping && JSON.parse(shipping);
    if (shippingFee.price == 0) setActiveStepIndex(activeStepIndex - 2);
    else setActiveStepIndex(activeStepIndex - 1);
  };

  return (
    <div>
      <div>
        <p className="text-xl mb-8 text-center">เลือกวิธีการชำระเงิน</p>
        <div
          className="mb-8 border-2 p-4 rounded-xl cursor-pointer"
          onClick={() => {
            document.getElementById("bordered-radio-1").checked = true;
            setPaymentMethod(1);
          }}
        >
          <div className="flex items-center pl-4 border-gray-200 rounded hover:cursor-pointer">
            <input
              id="bordered-radio-1"
              type="radio"
              name="payment_method"
              value="promptpay"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              onChange={handleChange}
            />
            <div className="ml-6">
              <label
                htmlFor="bordered-radio-1"
                className="hover:cursor-pointer flex gap-4 w-full py-4 text-sm font-medium text-gray-900 items-center"
              >
                <div className="w-[100px]">
                  <img
                    src="https://www.naiin.com/css/img/ThaiQRPayment.png"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <h6>ชำระเงินผ่าน QR Code (Mobile Banking)</h6>
              </label>
              <p className="text-gray-600 font-light">
                ไม่มีค่าธรรมเนียม และไม่ต้องแจ้งโอนเงิน
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <button
              className="flex items-center text-blue-700 bg-white border-2 border-gray-400 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              onClick={handlePrev}
            >
              <NavigateBeforeIcon />
              ย้อนกลับ
            </button>
          </div>
          <div className="hidden">
            <PaymentBtn paymentMethod={paymentMethod} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
