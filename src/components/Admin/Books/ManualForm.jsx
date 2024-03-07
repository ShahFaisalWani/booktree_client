import React, { useContext, useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import ManualGenreSelect from "./ManualGenreSelect";
import LoadingScreen from "../../Loading/LoadingScreen";
import ImgInput from "./ImgInput";
import { BookContext } from "./Book";

const ManualForm = ({ initial, onFinish }) => {
  const { genre, setGenre, supplier, setSupplier, setCoverImg, coverImg } =
    useContext(BookContext);

  useEffect(() => {
    if (initial) {
      setGenre(initial.genre);
      setCoverImg(initial.cover_img);
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleImgChange = (file) => {
    setCoverImg(file);
  };

  const colNames = [
    "รูปปก",
    "ISBN",
    "เรื่อง",
    "ผู้แต่ง",
    "หมวดหมู่",
    "ผู้แปล",
    "ราคา",
    "สำนักพิมพ์",
    "เนื้อเรื่อง",
    "น้ำหนัก",
    "ปีพิมพ์",
  ];

  const initialValues = {
    ISBN: initial?.ISBN || "",
    title: initial?.title || "",
    author: initial?.author || "",
    genre: initial?.genre || "",
    translator: initial?.translator || "",
    price: initial?.price || "",
    publisher: initial?.publisher || "",
    desc: initial?.desc || "",
    weight: initial?.weight || "",
    published_year: initial?.published_year || "",
  };

  const validationSchema = Yup.object({
    ISBN: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
    author: Yup.string(),
    genre: Yup.string(),
    publisher: Yup.string(),
    price: Yup.number().required("Required"),
    desc: Yup.string(),
    translator: Yup.string(),
    weight: Yup.string(),
    published_year: Yup.number(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (!genre) return toast.error("เลือกหมวดหมู่");
    const sup = supplier.supplier_name || initial.supplier_name;
    if (!sup) return toast.error("เลือกตัวแทนจำหน่าย");
    setIsLoading(true);

    const data = {
      ...values,
      ISBN: values.ISBN.trim(),
      supplier_name: sup,
      genre,
    };

    try {
      await axios
        .post(import.meta.env.VITE_API_BASEURL + "/book/add", [data])
        .then(() => {
          toast.success("เพิ่มหนังสือเรียบร้อย");
          resetForm({ values: "" });
          setGenre("");
          setCoverImg(null);
        })
        .catch(() => {
          toast.error(`หนังสือรหัส ${values.ISBN} มีในระบบแล้ว`);
          throw new Error("Book already exists");
        });
    } catch (err) {
      setIsLoading(false);
      return;
    }

    if (coverImg) {
      const formData = new FormData();
      formData.append("cover_img", coverImg);
      formData.append("ISBN", values.ISBN);
      formData.append("item", "book");

      await axios
        .post(import.meta.env.VITE_API_BASEURL + "/upload/book_cover", formData)
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }
    setIsLoading(false);
    setGenre("");
    setSupplier("");
    onFinish();
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
            <div>
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
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 ">
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
                      <>
                        <Field
                          as={col == "desc" ? "textarea" : ""}
                          type="text"
                          name={col}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />

                        <ErrorMessage
                          component="span"
                          name={col}
                          className="text-red-500 text-sm"
                        />
                      </>
                    )}
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

export default ManualForm;
