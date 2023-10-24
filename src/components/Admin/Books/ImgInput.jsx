import React, { useRef, useState } from "react";

const ImgInput = ({ selectedImg, handleImgChange }) => {
  const fileInputRef = useRef();

  const handleChange = (e) => {
    handleImgChange(e.target.files[0]);
  };

  return (
    <div className="container">
      <input type="file" ref={fileInputRef} onChange={handleChange} hidden />

      <div className="w-20 h-28 border-4">
        {selectedImg ? (
          <img
            src={
              typeof selectedImg == "object"
                ? URL.createObjectURL(selectedImg)
                : selectedImg
            }
            className="object-cover h-full w-full cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current.click();
            }}
          />
        ) : (
          <button
            className="flex justify-center items-center w-full h-full text-sm text-gray-500"
            onClick={(e) => {
              e.preventDefault();
              if (e.nativeEvent.pointerId == -1) return;
              fileInputRef.current.click();
            }}
          >
            upload +
          </button>
        )}
      </div>
    </div>
  );
};

export default ImgInput;
