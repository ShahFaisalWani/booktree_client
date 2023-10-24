import React, { useState, useRef, useEffect } from "react";
import "../styles/StatusSelect.scss";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ConfirmDeliveryEmail from "../services/ConfirmDeliveryEmail";
import { render } from "@react-email/render";
import { toast } from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  height: "fit",
  maxHeight: "75vh",
  overflow: "scroll",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 8,
};

const CustomDropdown = ({ order_id, status, customerObj }) => {
  const id = parseInt(order_id.split("INV")[1]);
  const [selectedValue, setSelectedValue] = useState(status);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [openDeli, setOpenDeli] = useState(false);

  const options = [
    { value: "pending", label: "Pending" },
    { value: "delivering", label: "Delivering" },
    { value: "completed", label: "Completed" },
    { value: "canceled", label: "Canceled" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const putStatus = async (query) => {
    await axios.put(
      import.meta.env.VITE_API_BASEURL + "/order/status?" + query
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOptionClick = async (value) => {
    setSelectedValue(value);
    setIsDropdownOpen(false);
    if (value == "delivering") setOpenDeli(true);
    else {
      await putStatus(`id=${id}&status=${value}`);
      window.location.reload(false);
    }
  };

  const handleDeliClose = () => {
    setOpenDeli(false);
    setSelectedValue("pending");
  };

  function getFormattedDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
  }

  const registerTracking = async (email, order_id, ems) => {
    const now = new Date();
    const formattedDateTime = getFormattedDateTime(now);
    const body = [
      {
        trackNo: ems,
        courierCode: "flashexpress",
        orderNo: order_id,
        country: "TH",
        shipTime: formattedDateTime,
        customerEmail: email,
      },
    ];
    const header = {
      headers: {
        "Track123-Api-Secret": import.meta.env.VITE_TRACK123_API,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      "https://api.track123.com/gateway/open-api/tk/v2/track/import",
      body,
      header
    );
  };

  const sendEmail = (customerObj, track_id) => {
    const emailObj = render(
      <ConfirmDeliveryEmail track_id={track_id} customerObj={customerObj} />
    );
    const data = {
      customer_email: customerObj.customer_email,
      email_obj: emailObj,
    };
    axios
      .post(import.meta.env.VITE_API_BASEURL + `/email/delivery`, data)
      .then((res) => {
        toast.success("ส่งเมลสำเร็จ");
      })
      .catch((err) => {
        toast.error("ส่งเมลไม่สำเร็จ");
      });
  };

  const handleDeliSubmit = async (e) => {
    const ems = e.target.ems.value;
    await putStatus(`id=${id}&status=delivering&ems=${ems}`);
    setOpenDeli(false);
    setSelectedValue("delivering");
    sendEmail(customerObj, ems);
    registerTracking(customerObj.customer_email, order_id, ems);
  };

  return (
    <>
      <div
        className="dropdown inline-block relative status_select"
        ref={dropdownRef}
      >
        <button
          onClick={toggleDropdown}
          className={`w-[130px] gap-2 justify-center border-2 border-blue-500 text-blue-700 font-semibold py-2 px-4 rounded inline-flex items-center ${selectedValue}`}
          disabled={selectedValue !== "pending"}
        >
          <span>{status}</span>
          {selectedValue == "pending" && (
            <svg
              className={`fill-current h-4 w-4 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
            </svg>
          )}
        </button>
        <ul
          className={`dropdown-menu absolute text-gray-700 pt-1 z-10 w-[130px] ${
            isDropdownOpen ? "opacity-100" : "opacity-0 invisible"
          } transition-all duration-300 transform ${
            isDropdownOpen ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          {options.map((option) => (
            <li key={option.value} className="w-[130px]">
              <button
                className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap w-full"
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        open={openDeli}
        onClose={handleDeliClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <button
              onClick={handleDeliClose}
              className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
            >
              <CloseIcon fontSize="medium" />
            </button>
            <form onSubmit={handleDeliSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="ems"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  หมายเลขพัสดุ
                </label>
                <input
                  type="text"
                  id="ems"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                  type="submit"
                >
                  ยืนยัน
                </button>
                <button
                  className="text-red-500 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                  onClick={handleDeliClose}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default CustomDropdown;
