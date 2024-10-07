import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImgInput from "./ImgInput";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Modal } from "@mui/material";
import { useQuery } from "react-query";
import LoadingScreen from "../../Loading/LoadingScreen";
import EditSupplierSelect from "../EditSupplierSelect";
import GenreSelect from "./GenreSelect";
import PublisherSelect from "./PublisherSelect";

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
  "ผู้แต่ง",
  "หมวดหมู่เดิม",
  "ผู้แปล",
  "หมวดหมู่",
  "สำนักพิมพ์",
  "ตำแทนจำหน่าย",
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
  old_genre: Yup.string(),
  genre: Yup.string(),
  publisher: Yup.string(),
  base_price: Yup.number().required("Required").typeError("Must be a number"),
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
  const [publisher, setPublisher] = useState(book.publisher);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    ISBN: book.ISBN || "",
    title: book.title || "",
    author: book.author || "",
    old_genre: book.old_genre || "",
    translator: book.translator || "",
    genre: book.genre || "",
    publisher: book.publisher || "",
    supplier_name: book.supplier_name || "",
    base_price: book.base_price || "",
    price: book.price || "",
    desc: book.desc || "",
    weight: book.weight || "",
    published_year: "",
  };

  // Fetch genres
  const fetchGenres = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASEURL}/book/genres`
    );
    return res.data;
  };
  const { data: genresData } = useQuery(["genres"], fetchGenres);
  const genresList = genresData?.map((item) => item.genre_name);

  const handleSubmit = async (values) => {
    const updatedData = {
      ...values,
      genre,
      publisher,
      supplier_name: supplier,
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
                          <GenreSelect
                            initial={book.genre}
                            onChange={setGenre}
                          />
                        ) : col === "publisher" ? (
                          <PublisherSelect
                            initial={book.publisher}
                            onChange={setPublisher}
                          />
                        ) : col === "supplier_name" ? (
                          <EditSupplierSelect
                            initial={book.supplier_name}
                            product="book"
                            onChange={setSupplier}
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
