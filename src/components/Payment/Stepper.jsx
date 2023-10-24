import React, { useContext, useEffect } from "react";
import { FormContext } from "../../pages/Checkout";

function Stepper() {
  const { activeStepIndex } = useContext(FormContext);
  useEffect(() => {
    const stepperItems = document.querySelectorAll(".stepper-item");
    stepperItems.forEach((step, i) => {
      if (i <= activeStepIndex) {
        step.classList.add("bg-blue-700", "text-white");
      } else {
        step.classList.remove("bg-blue-700", "text-white");
      }
    });
  }, [activeStepIndex]);

  return (
    <div className="w-3/5 flex flex-row items-center justify-center px-32 py-8">
      <div className="stepper-item w-36 h-8 text-center text-sm items-center flex justify-center font-medium border-2 rounded-full">
        1. ตะกร้าสินค้า
      </div>
      <div className="flex-auto border-t-2"></div>
      <div className="stepper-item w-36 h-8 text-center text-sm items-center flex justify-center font-medium border-2 rounded-full">
        2. ข้อมูลส่วนตัว
      </div>
      <div className="flex-auto border-t-2"></div>
      <div className="stepper-item w-36 h-8 text-center text-sm items-center flex justify-center font-medium border-2 rounded-full">
        3. ชำระเงิน
      </div>
    </div>
  );
}

export default Stepper;
