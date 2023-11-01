import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  //   width: "80%",
  //   height: "60vh",
  minWidth: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const MyModal = ({ children, onClose, width, height }) => {
  return (
    <Modal
      open={true}
      onClose={() => onClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          ...style,
          width: width ? width : "fit",
          height: height ? height : "fit",
        }}
      >
        <button
          onClick={() => onClose()}
          className="absolute right-7 top-7 text-gray-400 hover:text-red-500"
        >
          <CloseIcon fontSize="medium" />
        </button>
        <div className="flex flex-col h-full">{children}</div>
      </Box>
    </Modal>
  );
};

export default MyModal;
