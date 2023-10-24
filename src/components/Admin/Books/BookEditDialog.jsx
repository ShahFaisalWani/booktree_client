import React, { useContext, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImgInput from "./ImgInput";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  FormControl,
  Modal,
  TextField,
} from "@mui/material";
import { useQuery } from "react-query";
import LoadingScreen from "../../Loading/LoadingScreen";
import SupplierSelect from "./SupplierSelect";
import { BookContext } from "./Book";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 8,
  py: 6,
};

const BookEditDialog = ({ handleClose, book }) => {
  const { supplier, setSupplier } = useContext(BookContext);

  const onClose = () => {
    setSupplier("");
    handleClose();
  };
  const colNames = [
    "รูปปก",
    "ISBN",
    "เรื่อง",
    "ผู้แต่ง",
    "หมวดหมู่",
    "สำนักพิมพ์",
    "ตำแทนจำหน่าย",
    "ราคา",
    "เนื้อเรื่อง",
    "ผู้แปล",
    "น้ำหนัก (kg)",
  ];

  const initialValues = {
    ISBN: book.ISBN || "",
    title: book.title || "",
    author: book.author || "",
    genre: book.genre || "",
    publisher: book.publisher || "",
    supplier_name: book.supplier_name || "",
    price: book.price || "",
    desc: book.desc || "",
    translator: book.translator || "",
    weight: book.weight || "",
  };

  const validationSchema = Yup.object({
    ISBN: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
    author: Yup.string().required("Required"),
    genre: Yup.string(),
    publisher: Yup.string(),
    price: Yup.number().required("Required").typeError("Must be a number"),
    desc: Yup.string(),
    translator: Yup.string(),
    weight: Yup.number().typeError("Must be a number"),
  });

  const [coverImg, setCoverImg] = useState(book.cover_img);
  const [genre, setGenre] = useState(book.genre);
  const [loading, setLoading] = useState(false);

  const handleChange = (value) => {
    setGenre(value);
  };

  const handleImgChange = (file) => {
    setCoverImg(file);
  };

  const handleSubmit = async (values) => {
    const isSame = JSON.stringify(initialValues) === JSON.stringify(values);
    if (!isSame) {
      setLoading(true);
      const data = {
        ...values,
        genre: genre,
        supplier_name: supplier.supplier_name,
      };
      await axios
        .post(import.meta.env.VITE_API_BASEURL + "/book/edit", data)
        .catch((err) => {
          console.log(err);
        });

      if (coverImg) {
        if (typeof coverImg != "string") {
          const formData = new FormData();
          formData.append("cover_img", coverImg);
          formData.append("ISBN", values.ISBN);
          formData.append("item", "book");

          await axios
            .post(
              import.meta.env.VITE_API_BASEURL + "/upload/book_cover",
              formData
            )
            .catch((err) => {
              console.log(err);
            });
        }
      }
      setLoading(false);
      toast.success("แก้ไขเสร็จเรียบร้อย");
      setSupplier("");
      handleClose();
    } else {
      setSupplier("");
      handleClose();
    }
  };

  const fetchGenres = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASEURL + "/book/genres"
    );
    return res.data;
  };

  const { data } = useQuery(["genres"], fetchGenres);

  const genresList = data && data?.map((item) => item.genre_name);

  return (
    <div>
      {loading && <LoadingScreen />}
      <Modal
        open={true}
        onClose={onClose}
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
              <button
                onClick={onClose}
                className="absolute right-7 top-7 text-gray-400 hover:text-red-500"
              >
                <CloseIcon fontSize="medium" />
              </button>
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
                        {col == "genre" && (
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              {genresList && (
                                <Autocomplete
                                  disablePortal
                                  id="combo-box-demo"
                                  options={genresList}
                                  defaultValue={book.genre}
                                  renderInput={(params) => (
                                    <TextField {...params} label="หมวดหมู่" />
                                  )}
                                  onChange={(event, value) =>
                                    handleChange(value)
                                  }
                                />
                              )}
                            </FormControl>
                          </Box>
                        )}
                        {col == "supplier_name" && (
                          <SupplierSelect
                            initial={book.supplier_name}
                            product={"book"}
                          />
                        )}
                        {col !== "supplier_name" && col !== "genre" && (
                          <>
                            <Field
                              as={col == "desc" ? "textarea" : ""}
                              type="text"
                              name={col}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              disabled={col == "ISBN" || col == "supplier_name"}
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
