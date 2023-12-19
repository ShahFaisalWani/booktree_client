import React, { useEffect, useRef, useContext, useState } from "react";
import { clearCart } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { render } from "@react-email/render";
import ConfirmOrder from "../../services/ConfirmOrderEmail";
import toast from "react-hot-toast";
import { FormContext } from "../../pages/Checkout";
import { useNavigate } from "react-router-dom";
import AdminOrderEmail from "../../services/AdminOrderEmail";
import CircularProgress from "@mui/material/CircularProgress";

const PaymentBtn = ({ paymentMethod }) => {
  const cart = useSelector((state) => state.cart);
  const btnRef = useRef();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const calcNetTotal = () => {
    const shipping = JSON.parse(localStorage.getItem("shipping"));
    let totalPrice = 0;
    Object.values(cart.items).forEach((item) => {
      totalPrice += (item.price - item.discount) * item.quantity;
    });
    return (totalPrice + shipping.price).toFixed(2);
  };
  const netTotal = calcNetTotal();

  const { isPressed, setIsPressed, paymentLoading, setPaymentLoading } =
    useContext(FormContext);

  useEffect(() => {
    if (isPressed) {
      if (btnRef.current) {
        btnRef.current.click();
      }
    }
    return () => {
      setIsPressed(false);
    };
  }, [isPressed]);

  const user_order = localStorage.getItem("user_order");
  const userObj = localStorage.getItem("user");
  const userDetail = JSON.parse((user_order && user_order) || userObj);

  const sendEmail = async (order_num, order_date) => {
    const cusEmailObj = render(
      <ConfirmOrder order_num={order_num} order_date={order_date} />
    );
    const adminEmailObj = render(
      <AdminOrderEmail
        userDetail={userDetail}
        order_date={order_date}
        order_num={order_num}
      />
    );

    const data = {
      order_num,
      customer_email: userDetail.email,
      cus_email_obj: cusEmailObj,
      admin_email_obj: adminEmailObj,
    };
    await axios
      .post(import.meta.env.VITE_API_BASEURL + `/email/newOrder`, data)
      .then(() => {})
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  const addOrderDetail = async (order_details) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_BASEURL + "/order/addorderdetail",
        order_details
      );
    } catch (err) {
      console.log(err);
    }
  };

  const addOrder = async () => {
    try {
      const shipping = JSON.parse(localStorage.getItem("shipping"));
      const data = {
        customer_phone_number: userDetail.phone_number,
        total: netTotal,
        payment: "promptpay",
        deliver_to:
          shipping.label == "รับที่ร้าน" ? "Booktree" : userDetail?.address,
        shipping: shipping.label,
        shipping_fee: shipping.price,
        status: "pending",
      };

      const res = await axios.post(
        import.meta.env.VITE_API_BASEURL + "/order/addorder",
        data
      );

      const order_details = Object.keys(cart.items).map((item) => ({
        order_id: res.data.insertId,
        book_ISBN: cart.items[item].ISBN,
        quantity: cart.items[item].quantity,
        discount: cart.items[item].discount * cart.items[item].quantity,
      }));
      await addOrderDetail(order_details);
      return { id: res.data.insertId, date: res.data.date };
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (paymentMethod) {
      setPaymentLoading(true);
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);
      const response = await axios.post(
        import.meta.env.VITE_API_BASEURL + "/order/intent",
        {
          amount: netTotal * 100,
        }
      );
      if (!response.data) return toast.error("เกิดข้อผิดพลาด");
      const data = await response.data;
      const clientSecret = data.client_secret;
      setTimeout(() => {
        setPaymentLoading(false);
      }, 2000);
      const options = {
        payment_method: {
          type: "promptpay",
          billing_details: {
            email: userDetail.email,
          },
        },
      };

      stripe
        .confirmPromptPayPayment(clientSecret, options)
        .then(async (res) => {
          if (res.paymentIntent.status === "succeeded") {
            try {
              let { id, date } = await addOrder();
              const order_num = "INV" + String(id).padStart(5, "0");
              const order_date = new Date(date).toString();

              // await sendEmail(order_num, order_date);

              sessionStorage.setItem("success", "1");
              sessionStorage.setItem("successCart", JSON.stringify(cart.items));
              sessionStorage.setItem("successOrder", JSON.stringify(order_num));

              toast.success("Payment Successful!");
              dispatch(clearCart());
              sessionStorage.removeItem("memberId");
              sessionStorage.removeItem("isMember");
              navigateTo("/user/history");
            } catch (err) {
              console.log("Error occurred: ", err);
            }
          } else {
            toast.error("Failed!");
          }
        });
    } else {
      toast.error("โปรดเลือกวิธีชำระเงิน");
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <button
        id="submit-button"
        type="submit"
        className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        ref={btnRef}
        disabled={paymentLoading}
      >
        ชำระเงิน
      </button>
    </form>
  );
};

export default PaymentBtn;
