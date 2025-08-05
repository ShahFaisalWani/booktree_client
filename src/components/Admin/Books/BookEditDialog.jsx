import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImgInput from "./ImgInput";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Modal } from "@mui/material";
import LoadingScreen from "../../Loading/LoadingScreen";
import EditSupplierSelect from "../EditSupplierSelect";
import GenreSelect from "./GenreSelect";
import PublisherSelect from "./PublisherSelect";
import { useBookContext } from "../../../contexts/admin/BookContext";

const style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  py: 6,
};

const colNames = [
  "รูปปก",
  "ISBN",
  "เรื่อง",
  "ตำแทนจำหน่าย",
  "สำนักพิมพ์",
  "ผู้แต่ง",
  "ผู้แปล",
  "หมวดหมู่",
  "ต้นทุน",
  "ราคา",
  "เนื้อเรื่อง",
  "น้ำหนัก (kg)",
  "ปีพิมพ์",
];

const validationSchema = Yup.object({
  ISBN: Yup.string().required("Required"),
  title: Yup.string(),
  author: Yup.string(),
  genre: Yup.string(),
  publisher: Yup.string(),
  base_price: Yup.number().typeError("Must be a number"),
  price: Yup.number().required("Required").typeError("Must be a number"),
  desc: Yup.string(),
  translator: Yup.string(),
  weight: Yup.number().typeError("Must be a number"),
  published_year: Yup.number(),
});

const BookEditDialog = ({ handleClose, book }) => {
  const [supplier, setSupplier] = useState(book.supplier_name);
  const [coverImg, setCoverImg] = useState(book.cover_img);
  const [genre, setGenre] = useState(book.genre);
  // const [publisher, setPublisher] = useState(book.publisher);
  const { publisher, setPublisher } = useBookContext();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    ISBN: book.ISBN || "",
    title: book.title || "",
    supplier_name: book.supplier_name || "",
    publisher: book.publisher || "",
    author: book.author || "",
    translator: book.translator || "",
    genre: book.genre || "",
    base_price: book.base_price || "",
    price: book.price || "",
    desc: book.desc || "",
    weight: book.weight || "",
    published_year: "",
  };

  const handleSubmit = async (values) => {
    if (!genre) return toast.error("เลือกหมวดหมู่");
    if (!supplier) return toast.error("เลือกตัวแทนจำหน่าย");
    if (!publisher) return toast.error("เลือกสำนักพิมพ์");

    const updatedData = {
      ...values,
      genre,
      publisher,
      supplier_name: supplier.supplier_name,
    };

    const isSame =
      JSON.stringify(initialValues) === JSON.stringify(updatedData);
    if (isSame) {
      handleClose(false);
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/book/edit`,
        updatedData
      );

      if (coverImg && typeof coverImg !== "string") {
        const formData = new FormData();
        formData.append("cover_img", coverImg);
        formData.append("ISBN", values.ISBN);
        formData.append("item", "book");

        await axios.post(
          `${import.meta.env.VITE_API_BASEURL}/upload/book_cover`,
          formData
        );
      }

      toast.success("แก้ไขเสร็จเรียบร้อย");
      handleClose(true);
    } catch (err) {
      console.error("Error updating book:", err);
      toast.error("มีข้อผิดพลาดในการแก้ไข");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <LoadingScreen />}
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="overflow-auto">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="sticky top-0 w-fit ml-auto px-8">
                <button
                  onClick={() => handleClose(false)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <CloseIcon fontSize="medium" />
                </button>
              </div>
              <div className="px-16">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    {colNames[0]}
                  </label>
                  <ImgInput
                    selectedImg={coverImg}
                    handleImgChange={setCoverImg}
                  />
                  <ErrorMessage
                    component="span"
                    name="cover_img"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  {Object.keys(initialValues)
                    .filter((col) => col !== "cover_img")
                    .map((col, index) => (
                      <div key={index}>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          {colNames[index + 1]}
                        </label>

                        {col === "genre" ? (
                          <div className="relative">
                            <span className="absolute -top-[1.8rem] left-16">
                              เดิม: {book.old_genre || "-"}
                            </span>
                            <GenreSelect
                              initial={book.genre}
                              onChange={setGenre}
                            />
                          </div>
                        ) : col === "publisher" ? (
                          <div className="relative">
                            <span className="absolute -top-[1.8rem] left-20">
                              เดิม: {book.old_publisher || "-"}
                            </span>
                            <PublisherSelect
                              initial={book.publisher}
                              onChange={setPublisher}
                              supplierName={
                                supplier?.supplier_name || book.supplier_name
                              }
                            />
                          </div>
                        ) : col === "supplier_name" ? (
                          <EditSupplierSelect
                            initial={book.supplier_name}
                            product="book"
                            onChange={(sup) => {
                              setSupplier(sup);
                              setPublisher(null);
                            }}
                          />
                        ) : (
                          <>
                            <Field
                              as={col === "desc" ? "textarea" : "input"}
                              type="text"
                              name={col}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              disabled={[
                                "ISBN",
                                "supplier_name",
                                "old_genre",
                              ].includes(col)}
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
                    แก้ไข
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default BookEditDialog;
