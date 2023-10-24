import React, { useContext, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImgInput from "../Books/ImgInput";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Modal, TextField } from "@mui/material";
import LoadingScreen from "../../Loading/LoadingScreen";
import SupplierSelect from "../Books/SupplierSelect";
import { BookContext } from "../Books/Book";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  // height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 8,
  py: 10,
  pb: 5,
};

const StationeryEditDialog = ({ handleClose, book, refetchData }) => {
  const { supplier, setSupplier } = useContext(BookContext);

  const onClose = () => {
    setSupplier("");
    handleClose();
  };
  // const colNames = ["รูปปก", "ISBN", "ชื่อ", "ตัวแทนจำหน่าย", "ราคา"];
  const colNames = ["ISBN", "ชื่อ", "ตัวแทนจำหน่าย", "ราคา"];

  const initialValues = {
    ISBN: book.ISBN || "",
    title: book.title || "",
    supplier_name: book.supplier_name || "",
    price: book.price || "",
  };

  const validationSchema = Yup.object({
    ISBN: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
    supplier_name: Yup.string().required("Required"),
    price: Yup.number().required("Required"),
  });

  // const [coverImg, setCoverImg] = useState(book.cover_img);
  const [loading, setLoading] = useState(false);

  // const handleImgChange = (file) => {
  //   setCoverImg(file);
  // };

  const handleSubmit = async (values) => {
    const isSame = JSON.stringify(initialValues) === JSON.stringify(values);
    if (!isSame) {
      setLoading(true);
      const data = { ...values, supplier_name: supplier.supplier_name };

      await axios
        .post(import.meta.env.VITE_API_BASEURL + "/stationery/edit", data)
        .catch((err) => {
          console.log(err);
        });

      // if (typeof coverImg != "string") {
      //   const formData = new FormData();
      //   formData.append("cover_img", coverImg);
      //   formData.append("ISBN", values.ISBN);

      //   await axios
      //     .post(import.meta.env.VITE_API_BASEURL + "/upload/book_cover", formData)
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // }
      setLoading(false);
      toast.success("แก้ไขเสร็จเรียบร้อย");
      setSupplier("");
      refetchData();
      handleClose();
    } else {
      setSupplier("");
      handleClose();
    }
  };

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
              <div className="">
                <button
                  onClick={onClose}
                  className="absolute right-7 top-7 text-gray-400 hover:text-red-500"
                >
                  <CloseIcon fontSize="medium" />
                </button>
                {/* <div>
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
                <div className="grid gap-6 mb-6 md:grid-cols-2 ">
                  {Object.keys(initialValues).map((col, i) => (
                    <div key={i}>
                      <label
                        htmlFor={col}
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        {colNames[i]}
                      </label>
                      {col == "supplier_name" && (
                        <SupplierSelect
                          initial={book.supplier_name}
                          onChange={(value) => setSupplier(value)}
                          product={"other"}
                        />
                      )}
                      {col !== "supplier_name" && (
                        <Field
                          as={col == "desc" ? "textarea" : ""}
                          type="text"
                          name={col}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          required={"ISBNtitleprice".includes(col)}
                          disabled={col == "ISBN"}
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
                <div className="text-right pt-5">
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

export default StationeryEditDialog;
