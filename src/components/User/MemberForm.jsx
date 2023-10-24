import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

const MemberForm = ({ closeModal, onSuccess }) => {
  const initialValues = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("กรอกข้อมูล"),
    last_name: Yup.string().required("กรอกข้อมูล"),
    phone_number: Yup.string()
      .matches(/^[0-9]{10}$/, "เบอร์โทรไม่ถูกต้อง")
      .required("กรอกข้อมูล"),
    email: Yup.string().email("อีเมลไม่ถูกต้อง").required("กรอกข้อมูล"),
  });

  const createMember = async (memberData) => {
    const res = await axios.post(
      import.meta.env.VITE_API_BASEURL + "/member/create",
      memberData
    );
    return res.data;
  };

  const handleSubmit = async (values) => {
    const memberData = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      email: values.email,
    };

    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);
    const response = await axios.post(
      import.meta.env.VITE_API_BASEURL + "/order/intent",
      {
        amount: 150 * 100,
      }
    );
    const data = await response.data;
    const clientSecret = data.client_secret;

    await stripe
      .confirmPromptPayPayment(clientSecret, {
        payment_method: {
          type: "promptpay",
          billing_details: {
            email: memberData.email,
          },
        },
      })
      .then(async (res) => {
        if (res.paymentIntent.status === "succeeded") {
          try {
            const res = await createMember(memberData);
            onSuccess(memberData, res);
          } catch (err) {
            console.log("Error occurred: ", err);
          }
        } else {
          toast.error("Failed!");
        }
      });

    closeModal();
  };
  return (
    <div className="flex flex-col">
      <div className="text-center mb-7">
        <p className="text-xl">กรอกข้อมูล</p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="mb-6 flex  gap-5">
            <div className="w-full">
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                ชื่อ
              </label>
              <div className="relative">
                <Field
                  type="first_name"
                  name="first_name"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
              </div>
              <ErrorMessage
                component="span"
                name="first_name"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                นามสกุล
              </label>
              <div className="relative">
                <Field
                  type="last_name"
                  name="last_name"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
              </div>
              <ErrorMessage
                component="span"
                name="last_name"
                className="text-red-500 text-sm"
              />
            </div>
          </div>
          <div className=" mb-6">
            <label
              htmlFor="phone_number"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              เบอร์โทร
            </label>
            <div className="relative">
              <Field
                type="phone_number"
                name="phone_number"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              />
            </div>
            <ErrorMessage
              component="span"
              name="phone_number"
              className="text-red-500 text-sm"
            />
          </div>
          <div className=" mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              อีเมล
            </label>
            <div className="relative">
              <Field
                type="email"
                name="email"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              />
            </div>
            <ErrorMessage
              component="span"
              name="email"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex gap-5 justify-center pt-5">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none hover:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              สมัครสมาชิก
            </button>
          </div>
        </Form>
      </Formik>
      <div className="pt-12 text-gray-700">
        <p className="pb-2 text-black text-[18px]">ขั้นตอนการสมาชิก Booktree</p>
        <ul>
          <li className="mb-2">1. กรอกข้อมูลให้ครบถ้วนและถูกต้อง</li>
          <li className="mb-2">2. กดปุ่มสมัครสมาชิก</li>
          <li className="mb-2">3. ชำระเงินผ่านทางระบบ QR Promptpay</li>
          <li className="mb-2">4. ดาวน์โหลดหรือบันทึกบัตรสมาชิก</li>
        </ul>
      </div>
    </div>
  );
};

export default MemberForm;
