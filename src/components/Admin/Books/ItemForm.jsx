import React, { useContext, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import ManualGenreSelect from "./ManualGenreSelect";
import LoadingScreen from "../../Loading/LoadingScreen";
import ImgInput from "./ImgInput";
import { BookContext } from "./Book";
import SupplierSelect from "./SupplierSelect";

const ItemForm = ({ onFinish }) => {
  const { supplier, setSupplier, setCoverImg, coverImg } =
    useContext(BookContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleImgChange = (file) => {
    setCoverImg(file);
  };

  const colNames = ["รูปปก", "ISBN", "ชื่อ", "ราคา"];

  const initialValues = {
    ISBN: "",
    title: "",
    price: "",
  };

  const validationSchema = Yup.object({
    ISBN: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
    price: Yup.number().required("Required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (supplier) {
      setIsLoading(true);

      const data = {
        ...values,
        ISBN: values.ISBN.trim(),
        supplier_name: supplier.supplier_name,
      };

      try {
        await axios
          .post(import.meta.env.VITE_API_BASEURL + "/stationery/add", [data])
          .then(() => {
            resetForm({ values: "" });
            setCoverImg(null);
          })
          .catch((err) => {
            console.log(err);
            toast.error(`หนังสือรหัส ${values.ISBN} มีในระบบแล้ว`);
            throw new Error("Book already exists");
          });
      } catch (err) {
        setIsLoading(false);
        return;
      }

      // if (coverImg) {
      //   const formData = new FormData();
      //   formData.append("cover_img", coverImg);
      //   formData.append("ISBN", values.ISBN);
      //   formData.append("item", "other");

      //   await axios
      //     .post(
      //       import.meta.env.VITE_API_BASEURL + "/upload/book_cover",
      //       formData
      //     )
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // }

      toast.success("เพิ่มสินค้าเรียบร้อย");
      setSupplier("");
      onFinish();
      setIsLoading(false);
    } else {
      toast.error("เลือกตัวแทนจำหน่าย");
    }
  };

  return (
    <div className="px-16">
      {isLoading && <LoadingScreen />}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="">
            {/* <div className="mb-4">
              <label
                htmlFor="cover_img"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                {colNames[0]}
              </label>
              <ImgInput
                selectedImg={coverImg}
                handleImgChange={handleImgChange}
              />
              <ErrorMessage
                component="span"
                name="cover_img"
                className="text-red-500 text-sm"
              />
            </div> */}
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              {Object.keys(initialValues)
                .filter((col) => col !== "cover_img")
                .map((col, i) => (
                  <div key={i}>
                    <label
                      htmlFor={col}
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      {colNames[i + 1]}
                    </label>
                    {col == "genre" ? (
                      <ManualGenreSelect />
                    ) : (
                      <Field
                        as={col == "desc" ? "textarea" : ""}
                        type="text"
                        name={col}
                        className="border block items-center bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                        required={"ISBNtitleauthorpublisherprice".includes(col)}
                      />
                    )}

                    <ErrorMessage
                      component="span"
                      name={col}
                      className="text-red-500 text-sm"
                    />
                  </div>
                ))}
            </div>
            <div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Add
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ItemForm;
