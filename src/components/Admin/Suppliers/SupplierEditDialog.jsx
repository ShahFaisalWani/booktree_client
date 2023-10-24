import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Modal } from "@mui/material";
import LoadingScreen from "../../Loading/LoadingScreen";

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

const SupplierEditDialog = ({ handleClose, supplier, refetchData }) => {
  const onClose = () => {
    handleClose();
  };
  const colNames = [
    "ชื่อย่อ",
    "ชื่อเต็ม",
    "เปอร์เซ็นต์",
    "เบอร์โทร",
    "อีเมลฝ่ายขาย",
    "อีเมลฝ่ายบัญชี",
    "เลขภาษี",
    "ที่อยู่",
    "ธนาคาร",
    "บัญชี",
    "มัดจำ",
  ];

  const initialValues = {
    supplier_name: supplier.supplier_name || "",
    full_name: supplier.full_name || "",
    percent: supplier.percent || "",
    phone_number: supplier.phone_number || "",
    sales_email: supplier.sales_email || "",
    accountant_email: supplier.accountant_email || "",
    tax_number: supplier.tax_number || "",
    address: supplier.address || "",
    bank: supplier.bank || "",
    account: supplier.account || "",
    deposit: supplier.deposit || "",
  };

  const validationSchema = Yup.object({
    supplier_name: Yup.string(),
    full_name: Yup.string(),
    percent: Yup.number(),
    phone_number: Yup.string(),
    sales_email: Yup.string(),
    accountant_email: Yup.string(),
    tax_number: Yup.string(),
    address: Yup.string(),
    bank: Yup.string(),
    account: Yup.string(),
    deposit: Yup.number(),
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const data = { ...values };

    await axios
      .post(import.meta.env.VITE_API_BASEURL + "/supplier/edit", data)
      .then((res) => {
        toast.success("แก้ไขเสร็จเรียบร้อย");
        refetchData();
      })
      .catch((err) => {
        console.log(err);
        toast.error("เกิดข้อผิดพลาด");
      })
      .finally(() => {
        setLoading(false);
      });

    handleClose();
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
              <button
                onClick={onClose}
                className="absolute right-7 top-7 text-gray-400 hover:text-red-500"
              >
                <CloseIcon fontSize="medium" />
              </button>
              <div className="">
                <div className="grid gap-6 mb-6 md:grid-cols-2 ">
                  {Object.keys(initialValues).map((col, i) => (
                    <div key={i}>
                      <label
                        htmlFor={col}
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        {colNames[i]}
                      </label>

                      <Field
                        as={col == "desc" ? "textarea" : ""}
                        type="text"
                        name={col}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        disabled={col == "supplier_name"}
                      />

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

export default SupplierEditDialog;
