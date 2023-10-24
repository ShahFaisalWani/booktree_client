import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

const ProfileModal = ({ user, onClose }) => {
  const dispatch = useDispatch();

  const initialValues = {
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    address: user.address || "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("กรอกข้อมูล"),
    last_name: Yup.string().required("กรอกข้อมูล"),
    address: Yup.string(),
  });

  const handleSubmit = async (values) => {
    const data = {
      first_name: values.first_name,
      last_name: values.last_name,
      address: values.address,
    };
    await axios
      .post(import.meta.env.VITE_API_BASEURL + "/customer/changeinfo", data, {
        withCredentials: true,
      })
      .then(async (res) => {
        if (res.status == 200) {
          toast.success("แก้ไขข้อมูลเรียบร้อย");
          const userRes = await axios.get(
            import.meta.env.VITE_API_BASEURL +
              "/customer/id/" +
              user.customer_id
          );
          if (userRes.status == 200 && userRes.data.length > 0)
            dispatch(setUser(userRes.data[0]));
          onClose();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col">
      <div className="text-center mb-7">
        <p className="text-xl">แก้ไขข้อมูล</p>
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
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              ที่อยู่
            </label>
            <div className="relative">
              <Field
                type="address"
                name="address"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              />
            </div>
            <ErrorMessage
              component="span"
              name="address"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex gap-5 justify-center pt-5">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none hover:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              ยืนยัน
            </button>
            <button
              onClick={() => onClose()}
              className="text-red bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none hover:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              ยกเลิก
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ProfileModal;
