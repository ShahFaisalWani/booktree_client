import React, { useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import SupplierSelect from "../Books/SupplierSelect";
import { BookContext } from "../Books/Book";

const PublisherSupplierForm = ({ handleChange }) => {
  const { supplier } = useContext(BookContext);

  const initialValues = {
    publisher_name: "",
    supplier_name: supplier.supplier_name || "",
  };

  const validationSchema = Yup.object({
    publisher_name: Yup.string().required("Publisher name is required"),
    supplier_name: Yup.string().required("Supplier is required"),
  });

  const handleSubmit = async (values) => {
    const data = { ...values };

    await axios
      .post(import.meta.env.VITE_API_BASEURL + "/publisher/add", data)
      .then((res) => {
        toast.success("เพิ่มสนพสำเร็จ");
        handleChange();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error");
      });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="mb-6 flex gap-5 w-full">
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="publisher_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    ชื่อสำนักพิมพ์
                  </label>
                  <Field
                    type="text"
                    name="publisher_name"
                    className="w-[350px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  />
                  <ErrorMessage
                    component="span"
                    name="publisher_name"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="supplier_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    ตัวแทนจำหน่าย
                  </label>
                  <SupplierSelect
                    initial={initialValues.supplier_name}
                    onChange={(selectedSupplier) => {
                      setFieldValue(
                        "supplier_name",
                        selectedSupplier.supplier_name
                      );
                    }}
                  />
                  <ErrorMessage
                    component="span"
                    name="supplier_name"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-5 justify-center pt-5">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                เพิ่มสนพ
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PublisherSupplierForm;
