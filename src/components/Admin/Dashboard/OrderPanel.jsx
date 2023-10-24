import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery } from "react-query";
import axios from "axios";
import StatusSelect from "../../../components/StatusSelect";
import "../../../styles/OrderPanel.scss";
import SearchIcon from "@mui/icons-material/Search";
import { Input, InputAdornment } from "@mui/material";
import LoadingScreen from "../../Loading/LoadingScreen";
import RenderTracking from "../../RenderTracking";
import { Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "65%",
  bgcolor: "background.paper",
  boxShadow: 24,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function OrderPanel() {
  const [status, setStatus] = useState("pending");

  const orderObj = function (order, order_detail, i) {
    const total = order_detail.reduce((acc, val) => {
      return acc + parseInt(val.quantity);
    }, 0);

    const newDate = new Date(order.date)
      .toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
      })
      .split(",")[0];
    return {
      id: i,
      order_id: "INV" + String(order.order_id).padStart(5, "0") || "",
      date: newDate || "",
      items: total || "",
      customer_first_name: order.customer_first_name || "",
      customer_phone_number: order.customer_phone_number || "",
      customer_email: order.customer_email || "",
      total: order.total || "",
      payment: order.payment || "",
      deliver_to: order.deliver_to || "",
      status: order.status || "",
      EMS: order.EMS || "-",
      order_details: order_detail,
    };
  };

  const fetchMyData = async () => {
    let url = "/order/allorders/" + status;
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, data } = useQuery(["orders", status], fetchMyData);

  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (data) {
      setRows([]);
      const orderArr = [];
      Object.keys(data).map((order, i) => {
        orderArr.push(
          orderObj(data[order].order, data[order].order_details, i)
        );
      });

      const arrayReverseObj = orderArr.slice().reverse();
      setRows(arrayReverseObj);
    }
  }, [data]);

  const [searchValue, setSearchValue] = useState("");

  const filterRowsBySearchValue = () => {
    if (!searchValue) {
      return rows;
    }

    const filteredRows = rows.filter(
      (row) =>
        row.order_id.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.customer_phone_number
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        row.deliver_to.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filteredRows;
  };
  const [rowModal, setRowModal] = useState(false);
  const [currentRow, setCurrentRow] = useState([]);

  return (
    <div className="h-full mb-10">
      {isLoading && <LoadingScreen />}
      <div className="table-container-wrapper">
        <div className="flex justify-between items-center">
          <div className="status-buttons">
            <button
              type="button"
              className={status === "pending" ? "active" : ""}
              onClick={() => setStatus("pending")}
            >
              รอดำเนินการ
            </button>
            <button
              type="button"
              className={status === "delivering" ? "active" : ""}
              onClick={() => setStatus("delivering")}
            >
              กำลังขนส่ง
            </button>
            <button
              type="button"
              className={status === "completed" ? "active" : ""}
              onClick={() => setStatus("completed")}
            >
              สำเร็จ
            </button>
            <button
              type="button"
              className={status === "all" ? "active" : ""}
              onClick={() => setStatus("all")}
            >
              ทั้งหมด (100 ล่าสุด)
            </button>
          </div>
          <div className="search-input">
            <Input
              type="text"
              placeholder="ค้นหา..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              endAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, maxHeight: 600 }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell># ออเดอร์</StyledTableCell>
                <StyledTableCell align="right">เบอร์โทรลูกค้า</StyledTableCell>
                <StyledTableCell align="right">วันที่</StyledTableCell>
                <StyledTableCell align="right">จำนวน</StyledTableCell>
                <StyledTableCell align="right">ราคารวม</StyledTableCell>
                <StyledTableCell align="center" width={350}>
                  จัดส่งที่
                </StyledTableCell>
                <StyledTableCell align="center">หมายเลขพัสดุ</StyledTableCell>
                <StyledTableCell align="center">สถานะ</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterRowsBySearchValue().map((row, i) => (
                <TableRow
                  key={i}
                  sx={{
                    backgroundColor: i % 2 === 0 ? "#f0f0f0" : "#ffffff",
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    onClick={(e) => {
                      setRowModal(true);
                      setCurrentRow(row);
                    }}
                  >
                    {row.order_id}
                  </TableCell>
                  <TableCell align="right">
                    {row.customer_phone_number}
                  </TableCell>
                  <TableCell
                    align="right"
                    onClick={(e) => {
                      setRowModal(true);
                      setCurrentRow(row);
                    }}
                  >
                    {row.date}
                  </TableCell>
                  <TableCell
                    align="right"
                    onClick={(e) => {
                      setRowModal(true);
                      setCurrentRow(row);
                    }}
                  >
                    {row.items}
                  </TableCell>
                  <TableCell
                    align="right"
                    onClick={(e) => {
                      setRowModal(true);
                      setCurrentRow(row);
                    }}
                  >
                    {row.total}
                  </TableCell>
                  <TableCell
                    align="justify"
                    onClick={(e) => {
                      setRowModal(true);
                      setCurrentRow(row);
                    }}
                  >
                    {row.deliver_to}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={(e) => {
                      setRowModal(true);
                      setCurrentRow(row);
                    }}
                  >
                    {row.EMS}
                  </TableCell>
                  <TableCell align="center">
                    {row.EMS == "-" ? (
                      <StatusSelect
                        key={`${row.order_id}-${row.status}`}
                        order_id={row.order_id}
                        status={row.status}
                        customerObj={row}
                      />
                    ) : (
                      <RenderTracking
                        order_id={row.order_id}
                        track_id={row.EMS}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
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
          <div className="h-fit max-h-2/3 bg-white p-8 px-16 overflow-scroll">
            <p className="mb-4 flex flex-col gap-1">
              <span className="flex mb-1">
                <span className="w-1/3">
                  รายการสั่งซื้อหมายเลข: <b>{currentRow.order_id}</b>
                </span>
                <span>
                  วันที่: <b>{currentRow.date}</b>
                </span>
              </span>
              <span className="flex mb-1">
                <span className="w-1/3">
                  ราคารวม: <b>{currentRow.total}</b>
                </span>
                <span>
                  จำนวนรวม: <b>{currentRow.items}</b>
                </span>
              </span>
              <span className="flex mb-1">
                <span className="w-1/3">
                  ชำระโดย: <b>{currentRow.payment}</b>
                </span>
                <span>
                  หมายเลขพัสดุ: <b>{currentRow.EMS || "-"}</b>
                </span>
              </span>
            </p>
            <table className="w-full border-collapse border-[1px] border-gray-200">
              <thead>
                <tr className="bg-black">
                  <th className="border-0 text-left p-[8px] text-white">
                    ISBN
                  </th>
                  <th className="border-0 text-left p-[8px] text-white">
                    ชื่อสินค้า
                  </th>
                  <th className="border-0 text-left p-[8px] text-white">
                    ราคา
                  </th>
                  <th className="border-0 text-left p-[8px] text-white">
                    จำนวน
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRow?.order_details?.map((item, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-gray-200" : ""}>
                    <td className="text-left p-[8px]">{item.book.ISBN}</td>
                    <td className="text-left p-[8px]">{item.book.title}</td>
                    <td className="text-left p-[8px]">{item.book.price}</td>
                    <td className="text-left p-[8px]">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
