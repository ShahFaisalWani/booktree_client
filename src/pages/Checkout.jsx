import React, { createContext, useState } from "react";
import OrderSummary from "../components/Payment/OrderSummary";
import Stepper from "../components/Payment/Stepper";
import Step from "../components/Payment/Step";

export const FormContext = createContext();

const Checkout = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  return (
    <FormContext.Provider
      value={{
        activeStepIndex,
        setActiveStepIndex,
        isSubmitted,
        setIsSubmitted,
        isPressed,
        setIsPressed,
        paymentLoading,
        setPaymentLoading,
      }}
    >
      <div className="">
        <div className="flex justify-center">
          <Stepper />
        </div>
        <div className="flex flex-col gap-5 sm:gap-0 sm:flex-row">
          <div className="w-full sm:w-3/5 flex justify-center">
            <div className="w-full">
              <Step />
            </div>
          </div>
          <div className="w-full sm:w-2/5 flex justify-center">
            <div className="w-fit m-auto">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </FormContext.Provider>
  );
};

export default Checkout;
