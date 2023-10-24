import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().min(8, "Too short").required("Required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
    phone_number: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .required("Required"),
  });

  const handleSubmit = (values) => {
    const data = values;
    axios
      .post(import.meta.env.VITE_API_BASEURL + "/customer/register", data, {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(setUser(res.data));
        toast.success("Registered successfully");
        navigateTo("/");
      })
      .catch((err) => {
        const err_msg = err.response?.data?.message || JSON.stringify(err);
        toast.error(err_msg);
      });
  };

  const [showPass, setShowPass] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              First name
            </label>
            <Field
              type="text"
              name="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="John"
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
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Last name
            </label>
            <Field
              type="text"
              name="last_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Doe"
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
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <Field
              type="text"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="example@booktree.com"
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
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Phone number
            </label>
            <Field
              type="tel"
              name="phone_number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0123456789"
              pattern="[0-9]{10}"
              required
            />
            <ErrorMessage
              component="span"
              name="phone_number"
              className="text-red-500 text-sm"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <Field
              type={showPass ? "text" : "password"}
              name="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
              required
            />
            <ErrorMessage
              component="span"
              name="password"
              className="text-red-500 text-sm"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm_password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirm password
            </label>
            <Field
              type={showPass ? "text" : "password"}
              name="confirm_password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
              required
            />
            <ErrorMessage
              component="span"
              name="confirm_password"
              className="text-red-500 text-sm"
            />
          </div>
          <div className="flex gap-4">
            <Field
              type="checkbox"
              name="toggle"
              onClick={() => setShowPass((prev) => !prev)}
            />
            <label
              htmlFor="show_password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Show password
            </label>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Register
          </button>
        </div>
        <div>
          <label htmlFor="login">Already have an account?</label>
          <button
            className="text-blue-700 bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none hover:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={() => navigateTo("/login")}
          >
            Back to log in
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default RegisterForm;
