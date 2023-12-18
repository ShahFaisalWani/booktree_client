import React, { useEffect, useContext, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormContext } from "../../pages/Checkout";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const OrderForm = () => {
  const formRef = useRef();

  const { activeStepIndex, setActiveStepIndex, isSubmitted, setIsSubmitted } =
    useContext(FormContext);

  const user = localStorage.getItem("user");
  const user_order = localStorage.getItem("user_order");

  const userObject = function (user) {
    return {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      address: user.address || "",
    };
  };

  const initialValues = userObject(
    user_order ? JSON.parse(user_order) : JSON.parse(user)
  );

  const validationSchema = Yup.object({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    phone_number: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .required("Required"),
    address: Yup.string().required("Required"),
  });

  const handleSubmit = (values) => {
    localStorage.setItem("user_order", JSON.stringify(values));
    setActiveStepIndex(activeStepIndex + 1);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isSubmitted) {
      if (formRef.current) {
        formRef.current.handleSubmit();
      }
    }
    return () => {
      setIsSubmitted(false);
    };
  }, [isSubmitted]);

  const handlePrev = () => {
    setActiveStepIndex(activeStepIndex - 1);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
      onSubmit={handleSubmit}
      validateOnChange={() => {
        console.log("HIIII");
      }}
    >
      <Form className="">
        <p className="text-xl mb-8 text-center">การจัดส่งสินค้า</p>
        <div className="grid gap-6 mb-6 md:grid-cols-2 ">
          <div>
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              First name / ชื่อ
            </label>
            <Field
              type="text"
              name="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              required
            />
            <ErrorMessage
              component="span"
              name="first_name"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Last name / นามสกุล
            </label>
            <Field
              type="text"
              name="last_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              required
            />
            <ErrorMessage
              component="span"
              name="last_name"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email / อีเมล
            </label>
            <Field
              type="text"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              required
            />
            <ErrorMessage
              component="span"
              name="email"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="phone_number"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Phone number / เบอร์ติดต่อ
            </label>
            <Field
              type="tel"
              name="phone_number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              pattern="[0-9]{10}"
              required
            />
            <ErrorMessage
              component="span"
              name="phone_number"
              className="text-red-500 text-sm"
            />
          </div>
        </div>
        <div className="mb-6 ">
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            ที่อยู่ (บ้านเลขที่ / ซอย / ถนน / ตำบล / อำเภอ / จังหวัด)
          </label>
          <Field
            type="text"
            name="address"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            required
          />
          <ErrorMessage
            component="span"
            name="address"
            className="text-red-500 text-sm"
          />
        </div>
        <div className="flex justify-between gap-20">
          <button
            className="flex items-center text-blue-700 bg-white border-2 border-gray-400 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={handlePrev}
          >
            <NavigateBeforeIcon />
            ย้อนกลับ
          </button>
          <button
            className="sm:hidden flex justify-center items-center text-white bg-blue-700  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={() => setIsSubmitted(true)}
          >
            ต่อไป
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default OrderForm;
