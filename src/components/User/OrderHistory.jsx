import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "react-query";
import axios from "axios";
import LoadingScreen from "../Loading/LoadingScreen";
import "../../styles/StatusSelect.scss";

import { Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import SuccessModal from "../Payment/SuccessModal";
import RenderTracking from "../RenderTracking";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "85vw",
  height: "80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
};

const OrderHistory = () => {
  const orderObj = function (order, order_detail, i) {
    const total = order_detail.reduce((acc, val) => {
      return acc + parseInt(val.quantity);
    }, 0);

    const newDate = new Date(order.date)
      .toLocaleString("en-GB", {
        timeZone: "Asia/Bangkok",
      })
      .split(",")[0];

    return {
      id: i,
      order_id: "INV" + String(order.order_id).padStart(5, "0") || "",
      date: newDate || "",
      items: total || "",
      total: order.total || "",
      payment: order.payment || "",
      shipping: order.shipping || "",
      shipping_fee: order.shipping_fee || "",
      deliver_to: order.deliver_to || "รับที่ร้าน",
      EMS: order.EMS || "-",
      order_details: order_detail,
      status: order.status,
    };
  };

  const url = "/customer/orders";

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url, {
      withCredentials: true,
    });
    return res.data;
  };

  const { isLoading, error, data } = useQuery(["order_history"], fetchMyData);

  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (data) {
      const arrayReverseObj = Object.keys(data)
        .sort()
        .reverse()
        .map((key) => ({ ...data[key], key }));

      const orderArr = [];
      Object.keys(arrayReverseObj).map((order, i) => {
        orderArr.push(
          orderObj(
            arrayReverseObj[order].order,
            arrayReverseObj[order].order_details,
            i
          )
        );
      });
      setRows(orderArr);
    }
  }, [data]);

  const [rowModal, setRowModal] = useState(false);
  const [currentRow, setCurrentRow] = useState([]);

  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const success = sessionStorage.getItem("success");
    setOpen(success == "1" ? true : false);
    const successCart = sessionStorage.getItem("successCart");
    if (successCart) setCart(JSON.parse(successCart));
    const successOrder = sessionStorage.getItem("successOrder");
    if (successOrder) setOrderId(JSON.parse(successOrder));
  }, [
    sessionStorage.getItem("success"),
    sessionStorage.getItem("successCart"),
    sessionStorage.getItem("successOrder"),
  ]);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.removeItem("success");
    sessionStorage.removeItem("successCart");
    sessionStorage.removeItem("successOrder");
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <p>Error</p>;

  const columns = [
    { field: "order_id", headerName: "หมายเลขออเดอร์", width: 150 },
    {
      field: "date",
      headerName: "วันที่",
      width: 120,
      hide: true,
    },
    { field: "items", headerName: "จำนวน", width: 75 },
    { field: "total", headerName: "ราคารวม", width: 150 },
    {
      field: "payment",
      headerName: "ชำระโดย",
      width: 150,
      renderCell: (params) => {
        return (
          <p>{params.row.payment == "cash" ? "เงินสด" : params.row.payment}</p>
        );
      },
    },

    {
      field: "EMS",
      headerName: "EMS",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "สถานะ",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <RenderTracking
            order_id={params.row.order_id}
            track_id={params.row.EMS}
          />
        );
      },
    },
  ];

  return (
    <div>
      <p className="border-b-2 w-full mb-10 pb-5 text-lg text-blue-500 font-bold tracking-wider">
        ประวัติการซื้อ
      </p>
      <Box sx={{ maxHeight: "90vh", width: "100%", margin: "auto" }}>
        <DataGrid
          disableColumnFilter
          disableDensitySelector
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 15,
              },
            },
          }}
          pageSizeOptions={[15]}
          onRowClick={(params) => {
            setRowModal(true);
            setCurrentRow(params.row);
          }}
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button
            onClick={handleClose}
            className="absolute right-7 top-7 text-white"
          >
            <CloseIcon fontSize="medium" />
          </button>
          <SuccessModal orderId={orderId} cart={cart} />
        </Box>
      </Modal>
      <Modal
        open={rowModal}
        onClose={() => setRowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button
            onClick={() => setRowModal(false)}
            className="absolute right-7 top-7 text-red-500"
          >
            <CloseIcon fontSize="medium" />
          </button>
          <div className="h-fit max-h-2/3 bg-white p-1 py-16 sm:p-8 sm:px-16 overflow-scroll text-xs sm:text-lg border-4">
            <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-1">
              <span>
                รายการสั่งซื้อหมายเลข: <b>{currentRow.order_id}</b>
              </span>
              <span>
                ราคารวม: <b>{currentRow.total + " บาท"}</b>
              </span>
              <span>
                ชำระโดย: <b>{currentRow.payment}</b>
              </span>
              <span>
                วันที่: <b>{currentRow.date}</b>
              </span>
              <span>
                จำนวนรวม: <b>{currentRow.items}</b>
              </span>
              <span>
                หมายเลขพัสดุ: <b>{currentRow.EMS || "-"}</b>
              </span>
              <span>
                จัดส่งไปยังที่อยู่: <b>{currentRow.deliver_to || ""}</b>
              </span>
              <span>
                ค่าจัดส่ง:{" "}
                <b>
                  {typeof currentRow.shipping_fee === "number"
                    ? currentRow.shipping_fee + " บาท"
                    : "0 บาท"}
                </b>
              </span>
              {/* <span className="flex flex-col gap-1">
                <span>
                  รายการสั่งซื้อหมายเลข: <b>{currentRow.order_id}</b>
                </span>
                <span>
                  ราคารวม: <b>{currentRow.total + " บาท"}</b>
                </span>
                <span>
                  ชำระโดย: <b>{currentRow.payment}</b>
                </span>
              </span>
              <span className="flex flex-col gap-1">
                <span>
                  วันที่: <b>{currentRow.date}</b>
                </span>
                <span>
                  จำนวนรวม: <b>{currentRow.items}</b>
                </span>
                <span>
                  หมายเลขพัสดุ: <b>{currentRow.EMS || "-"}</b>
                </span>
              </span>
              <span className="flex flex-col gap-1">
                <span>
                  จัดส่งไปยังที่อยู่: <b>{currentRow.deliver_to || ""}</b>
                </span>
                <span>
                  ค่าจัดส่ง:{" "}
                  <b>
                    {typeof currentRow.shipping_fee === "number"
                      ? currentRow.shipping_fee + " บาท"
                      : "0 บาท"}
                  </b>
                </span>
              </span> */}
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black">
                  <th className="border-0 text-left w-[35%] p-1 sm:p-[8px] text-white">
                    ISBN
                  </th>
                  <th className="border-0 text-left w-[40%] p-1 sm:p-[8px] text-white">
                    ชื่อสินค้า
                  </th>
                  <th className="border-0 text-left w-[15%] p-1 sm:p-[8px] text-white">
                    ราคา
                  </th>
                  <th className="border-0 text-left w-[10%] p-1 sm:p-[8px] text-white">
                    จำนวน
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRow?.order_details?.map((item, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-gray-200" : ""}>
                    <td className="text-left w-[35%] p-1 sm:p-[8px]">
                      {item.book.ISBN}
                    </td>
                    <td className="text-left w-[40%] p-1 sm:p-[8px]">
                      {item.book.title}
                    </td>
                    <td className="text-left w-[15%] p-1 sm:p-[8px]">
                      {item.book.price}
                    </td>
                    <td className="text-left w-[10%] p-1 sm:p-[8px]">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default OrderHistory;
