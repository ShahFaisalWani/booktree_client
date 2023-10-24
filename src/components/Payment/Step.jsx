import React, { useContext } from "react";
import { FormContext } from "../../pages/Checkout";
import CartDisplay from "../Cart/CartDisplay";
import OrderForm from "./OrderForm";
import PaymentForm from "./PaymentForm";

function Step() {
  const { activeStepIndex } = useContext(FormContext);
  let stepContent;
  switch (activeStepIndex) {
    case 0:
      stepContent = <CartDisplay />;
      break;
    case 1:
      stepContent = <OrderForm />;
      break;
    case 2:
      stepContent = <PaymentForm />;
      break;
    default:
      break;
  }

  return stepContent;
}

export default Step;
