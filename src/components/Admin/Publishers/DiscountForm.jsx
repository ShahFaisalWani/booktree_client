import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import RangePicker from "../Reports/RangePicker";
import axios from "axios";

const DiscountForm = ({ publishers, onFinish }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const initialValues = {
    publishers: publishers.map((p) => p.publisher_name),
    publisher_discount: "",
    start_date: "",
    end_date: "",
  };

  const validationSchema = Yup.object({
    publisher_discount: Yup.number()
      .min(1, "ต้องมากกว่า 1%")
      .max(100, "ต้องน้อยกว่า 100%")
      .required("Discount is required"),
    start_date: Yup.string().required("Start date is required"),
    end_date: Yup.string()
      .required("End date is required")
      .test(
        "end_date",
        "วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น",
        function (value) {
          const { start_date } = this.parent;
          return start_date && value
            ? new Date(value) > new Date(start_date)
            : true;
        }
      ),
  });

  const handleSubmit = async (values) => {
    const data = {
      ...values,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      await axios.post(
        import.meta.env.VITE_API_BASEURL + "/publisher/update-discount",
        data
      );
      toast.success("กำหนดส่วนลดสำเร็จ");
      onFinish();
    } catch (error) {
      console.error(error);
      toast.error("Error");
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="mb-6">
              <label
                htmlFor="publisher_discount"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                เปอร์เซ็นต์ส่วนลด (%)
              </label>
              <Field
                type="number"
                name="publisher_discount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              <ErrorMessage
                component="span"
                name="publisher_discount"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-6 flex flex-col items-center gap-2">
              <RangePicker
                start={startDate}
                end={endDate}
                onStartChange={(date) => {
                  setStartDate(date);
                  setFieldValue("start_date", date);
                }}
                onEndChange={(date) => {
                  setEndDate(date);
                  setFieldValue("end_date", date);
                }}
              />
              <ErrorMessage
                component="span"
                name="start_date"
                className="text-red-500 text-sm"
              />
              <ErrorMessage
                component="span"
                name="end_date"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Apply Discount
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DiscountForm;
