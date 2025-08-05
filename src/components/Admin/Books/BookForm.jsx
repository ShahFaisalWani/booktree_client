import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import LoadingScreen from "../../Loading/LoadingScreen";
import FormField from "./FormField";
import { BOOK_FORM_CONFIG } from "./bookFormConfig";
import { useBookContext } from "../../../contexts/admin/BookContext";

const modalStyle = {
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

const BookForm = ({
  book = null,
  onSuccess,
  onCancel,
  showModal = true,
  title = null,
}) => {
  const isEdit = !!book;
  const modalTitle = title || (isEdit ? "แก้ไขหนังสือ" : "เพิ่มหนังสือ");

  const {
    genre,
    setGenre,
    supplier,
    setSupplier,
    publisher,
    setPublisher,
    coverImg,
    setCoverImg,
    resetFormState,
    prefetchPublishers,
  } = useBookContext();

  const [isLoading, setIsLoading] = useState(false);
  const [localSupplier, setLocalSupplier] = useState(null);
  const [localGenre, setLocalGenre] = useState("");
  const [localPublisher, setLocalPublisher] = useState("");
  const [localCoverImg, setLocalCoverImg] = useState(null);

  // Initialize form state
  useEffect(() => {
    if (isEdit && book) {
      setLocalSupplier(book.supplier_name);
      setLocalGenre(book.genre || "");
      setLocalPublisher(book.publisher || "");
      setLocalCoverImg(book.cover_img);

      // Prefetch publishers for edit mode
      if (book.supplier_name && book.supplier_name !== "All") {
        prefetchPublishers(book.supplier_name);
      }

      // Don't set context state in edit mode - use local state
    } else {
      // Reset for add mode - use context state
      setLocalSupplier(supplier?.supplier_name || "");
      setLocalGenre(genre || "");
      setLocalPublisher(publisher || "");
      setLocalCoverImg(coverImg);
    }
  }, [book, isEdit, prefetchPublishers, supplier, genre, publisher, coverImg]);

  const validationSchema = Yup.object({
    ISBN: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
    author: Yup.string(),
    publisher: Yup.string(),
    base_price: Yup.number().typeError("Must be a number"),
    price: Yup.number().required("Required").typeError("Must be a number"),
    desc: Yup.string(),
    translator: Yup.string(),
    weight: Yup.number().typeError("Must be a number"),
    published_year: Yup.number().typeError("Must be a number"),
  });

  const handleImgChange = (file) => {
    setLocalCoverImg(file);
    setCoverImg(file);
  };

  const handleGenreChange = (selectedGenre) => {
    if (isEdit) {
      setLocalGenre(selectedGenre || "");
    } else {
      setGenre(selectedGenre || "");
      setLocalGenre(selectedGenre || "");
    }
  };

  const handlePublisherChange = (selectedPublisher) => {
    if (isEdit) {
      setLocalPublisher(selectedPublisher || "");
    } else {
      setPublisher(selectedPublisher || "");
      setLocalPublisher(selectedPublisher || "");
    }
  };

  const handleSupplierChange = (selectedSupplier) => {
    setLocalSupplier(selectedSupplier);
    setSupplier(selectedSupplier);
    // Reset publisher when supplier changes
    setLocalPublisher("");
    if (!isEdit) {
      setPublisher("");
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    // Validation
    if (!localGenre) {
      toast.error("เลือกหมวดหมู่");
      return;
    }

    const supplierName =
      localSupplier?.supplier_name || localSupplier || supplier?.supplier_name;
    if (!supplierName) {
      toast.error("เลือกตัวแทนจำหน่าย");
      return;
    }

    if (!localPublisher) {
      toast.error("เลือกสำนักพิมพ์");
      return;
    }

    setIsLoading(true);

    try {
      const formData = {
        ...values,
        ISBN: values.ISBN.trim(),
        supplier_name: supplierName,
        genre: localGenre,
        publisher: localPublisher,
      };

      let apiEndpoint, successMessage;

      if (isEdit) {
        const initialValues = BOOK_FORM_CONFIG.getInitialValues(book, supplier);
        const isSame =
          JSON.stringify(initialValues) === JSON.stringify(formData);
        if (isSame && localCoverImg === book.cover_img) {
          toast.error("ไม่มีการเปลี่ยนแปลงข้อมูล", {
            icon: "⚠️",
          });
          return;
        }

        apiEndpoint = "/book/edit";
        successMessage = "แก้ไขเสร็จเรียบร้อย";
      } else {
        // Add mode
        apiEndpoint = "/book/add";
        successMessage = "เพิ่มหนังสือเรียบร้อย";
      }

      // Submit book data
      await axios.post(
        `${import.meta.env.VITE_API_BASEURL}${apiEndpoint}`,
        isEdit ? formData : [formData]
      );

      // Handle image upload
      if (localCoverImg && typeof localCoverImg !== "string") {
        const imageFormData = new FormData();
        imageFormData.append("cover_img", localCoverImg);
        imageFormData.append("ISBN", values.ISBN);
        imageFormData.append("item", "book");

        await axios.post(
          `${import.meta.env.VITE_API_BASEURL}/upload/book_cover`,
          imageFormData
        );
      }

      toast.success(successMessage);

      if (!isEdit) {
        resetForm();
        // Reset local state
        setLocalGenre("");
        setLocalPublisher("");
        setLocalCoverImg(null);
        // Reset context state
        resetFormState();
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error submitting book:", error);
      if (
        error.response?.status === 409 ||
        error.response?.data?.includes("already exists")
      ) {
        toast.error(`หนังสือรหัส ${values.ISBN} มีในระบบแล้ว`);
      } else {
        toast.error("มีข้อผิดพลาดในการบันทึก");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset states
    if (!isEdit) {
      setLocalGenre("");
      setLocalPublisher("");
      setLocalCoverImg(null);
      resetFormState();
    }
    onCancel?.();
  };

  const getFieldProps = (field) => {
    const props = {
      name: field.name,
      label: field.label,
      type: field.type,
      disabled:
        (field.disabledOnEdit && isEdit) ||
        (field.name === "supplier_name" && !isEdit),
      as: field.type === "textarea" ? "textarea" : "input",
    };

    // Add special field handlers
    if (field.type === "genre") {
      props.isGenre = true;
      props.onGenreChange = handleGenreChange;
      props.initialValue = isEdit ? book?.genre : "";
      if (isEdit) {
        props.value = localGenre;
        props.useLocalState = true;
      }
    } else if (field.type === "publisher") {
      props.isPublisher = true;
      props.onPublisherChange = handlePublisherChange;
      props.supplierName = localSupplier?.supplier_name || localSupplier;
      props.initialValue = isEdit ? book?.publisher : "";
      props.oldValue = isEdit ? book?.old_publisher : null;
      if (isEdit) {
        props.value = localPublisher;
        props.useLocalState = true;
      }
    } else if (field.type === "supplier") {
      props.isEditSupplier = true;
      props.onSupplierChange = handleSupplierChange;
      props.initialValue = book?.supplier_name;
      props.product = "book";
    }

    // Add old value for display
    if (isEdit && field.name === "genre" && book?.old_genre) {
      props.oldValue = book.old_genre;
    }

    return props;
  };

  const renderFormContent = () => (
    <div className="px-16">
      {isLoading && <LoadingScreen />}
      <Formik
        initialValues={BOOK_FORM_CONFIG.getInitialValues(book, supplier)}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form>
          <div>
            {/* Cover Image */}
            <FormField
              name="cover_img"
              label={BOOK_FORM_CONFIG.labels[0]}
              isImage={true}
              selectedImg={localCoverImg}
              onImageChange={handleImgChange}
            />

            {/* Form Fields */}
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              {BOOK_FORM_CONFIG.fields
                .filter((field) => !field.editOnly || isEdit)
                .map((field) => (
                  <FormField key={field.name} {...getFieldProps(field)} />
                ))}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                {isEdit ? "แก้ไข" : "เพิ่ม"}
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-red-500 bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  ยกเลิก
                </button>
              )}
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );

  if (!showModal) {
    return renderFormContent();
  }

  return (
    <Modal
      open={true}
      aria-labelledby="book-form-modal-title"
      aria-describedby="book-form-modal-description"
    >
      <Box sx={modalStyle} className="overflow-auto">
        <div className="sticky top-0 w-fit ml-auto px-8">
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-red-500"
          >
            <CloseIcon fontSize="medium" />
          </button>
        </div>
        {renderFormContent()}
      </Box>
    </Modal>
  );
};

export default BookForm;
