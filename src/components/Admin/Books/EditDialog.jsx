import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LoadingScreen from "../../Loading/LoadingScreen";
import ExcelGenreSelect from "./ExcelGenreSelect";
import ImgInput from "./ImgInput";
import ExcelPublisherSelect from "./ExcelPublisherSelect";

const EditDialog = ({ initial, changeInitial, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [inputData, setInputData] = useState(initial);

  const colNames = [
    "รูปปก",
    "ISBN",
    "เรื่อง",
    "หมวดหมู่เดิม",
    "หมวดหมู่",
    "ผู้แต่ง",
    "สำนักพิมพ์",
    "ต้นทุน",
    "ราคา",
    "เนื้อเรื่อง",
    "ผู้แปล",
    "น้ำหนัก (kg)",
    "ปีพิมพ์",
  ];

  const initialValues = {
    ISBN: inputData.ISBN || "",
    title: inputData.title || "",
    old_genre: inputData.old_genre || "",
    genre: inputData.genre || "",
    author: inputData.author || "",
    publisher: inputData.publisher || "",
    base_price: inputData.base_price || "",
    price: inputData.price || "",
    desc: inputData.desc || "",
    translator: inputData.translator || "",
    weight: inputData.weight || "",
    published_year: "",
  };

  const validationSchema = Yup.object({
    ISBN: Yup.string().required("Required"),
    title: Yup.string(),
    old_genre: Yup.string(),
    genre: Yup.string(),
    author: Yup.string(),
    publisher: Yup.string(),
    base_price: Yup.number().typeError("Must be a number"),
    price: Yup.number().required("Required").typeError("Must be a number"),
    desc: Yup.string(),
    translator: Yup.string(),
    weight: Yup.number().typeError("Must be a number"),
    published_year: Yup.number(),
  });

  const handleGenreChange = (genre) => {
    const updatedBook = { ...inputData, genre: genre };
    setInputData(updatedBook);
  };

  const handlePublisherChange = (pub) => {
    const updatedBook = { ...inputData, publisher: pub };
    setInputData(updatedBook);
  };

  const handleImgChange = (file) => {
    const updatedBook = { ...inputData, cover_img: file };
    setInputData(updatedBook);
    changeInitial(updatedBook);
  };

  const handleSubmit = (values) => {
    const newData = {
      ...values,
      genre: inputData.genre,
      publisher: inputData.publisher,
      cover_img: inputData.cover_img,
    };
    changeInitial(newData);
    onClose();
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
            <div className="mb-6">
              <label
                htmlFor="cover_img"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                {colNames[0]}
              </label>
              <ImgInput
                selectedImg={inputData.cover_img || null}
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
                      <ExcelGenreSelect
                        handleGenreChange={handleGenreChange}
                        selectedGenre={inputData.genre || null}
                      />
                    ) : col == "publisher" ? (
                      <ExcelPublisherSelect
                        handlePublisherChange={handlePublisherChange}
                        selectedPublisher={inputData.publisher || null}
                      />
                    ) : (
                      <Field
                        as={col == "desc" ? "textarea" : ""}
                        type="text"
                        name={col}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        disabled={col == "ISBN" || col == "old_genre"}
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
            <div className="flex gap-5 pt-5">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
              >
                แก้ไข
              </button>
              <button
                type="button"
                className="text-red-500 bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
                onClick={() => onClose()}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default EditDialog;
