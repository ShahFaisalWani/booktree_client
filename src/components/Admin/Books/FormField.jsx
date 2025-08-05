import React from "react";
import { Field, ErrorMessage } from "formik";
import GenreSelect from "./GenreSelect";
import PublisherSelect from "./PublisherSelect";
import EditSupplierSelect from "../EditSupplierSelect";
import ImgInput from "./ImgInput";

const FormField = ({
  name,
  label,
  type = "text",
  as = "input",
  disabled = false,
  required = false,
  className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
  // Special field props
  isGenre = false,
  isPublisher = false,
  isEditSupplier = false,
  isImage = false,
  // Handler props
  onGenreChange,
  onPublisherChange,
  onSupplierChange,
  onImageChange,
  // Values
  initialValue,
  value,
  supplierName,
  selectedImg,
  product = "book",
  useLocalState = false,
  // Additional info
  oldValue,
}) => {
  const renderField = () => {
    if (isImage) {
      return (
        <ImgInput selectedImg={selectedImg} handleImgChange={onImageChange} />
      );
    }

    if (isGenre) {
      return (
        <GenreSelect
          initial={initialValue}
          onChange={onGenreChange}
          value={value}
          useLocalState={useLocalState}
        />
      );
    }

    if (isPublisher) {
      return (
        <PublisherSelect
          initial={initialValue}
          onChange={onPublisherChange}
          supplierName={supplierName}
          value={value}
          useLocalState={useLocalState}
        />
      );
    }

    if (isEditSupplier) {
      return (
        <EditSupplierSelect
          initial={initialValue}
          product={product}
          onChange={onSupplierChange}
        />
      );
    }

    return (
      <Field
        as={as}
        type={type}
        name={name}
        className={className}
        disabled={disabled}
        required={required}
      />
    );
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
        {oldValue && (
          <span className="text-xs text-gray-500 ml-2">(เดิม: {oldValue})</span>
        )}
      </label>

      {renderField()}

      <ErrorMessage
        component="span"
        name={name}
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default FormField;
