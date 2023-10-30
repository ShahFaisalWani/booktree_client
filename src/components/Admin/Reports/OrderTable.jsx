import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const OrderTable = ({
  rows,
  totalCash,
  totalTransfer,
  totalQuantity,
  totalDiscount,
  totalSum,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow className=" border-y-2 border-black">
            <TableCell>ISBN</TableCell>
            <TableCell align="center">ชื่อ</TableCell>
            <TableCell align="center">ราคา</TableCell>
            <TableCell align="center">จำนวน</TableCell>
            <TableCell align="center">ส่วนลด</TableCell>
            <TableCell align="center">รวม</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.ISBN}
              </TableCell>
              <TableCell align="center">{row.title}</TableCell>
              <TableCell align="center">{row.price.toFixed(2)}</TableCell>
              <TableCell align="center">{row.quantity}</TableCell>
              <TableCell align="center">{row.discount.toFixed(2)}</TableCell>
              <TableCell align="center">{row.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-gray-200 border-t-2 border-black">
            <TableCell align="left" colSpan={3}>
              <strong>ยอดรวม:</strong>
            </TableCell>
            <TableCell align="center" colSpan={1}>
              <strong>{totalQuantity}</strong>
            </TableCell>
            <TableCell align="center" colSpan={1}>
              <strong>{totalDiscount.toFixed(2)}</strong>
            </TableCell>
            <TableCell align="center" colSpan={1}>
              <strong>{totalSum.toFixed(2)}</strong>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white">
            <TableCell align="left" colSpan={5}>
              <strong>เงินสด:</strong>
            </TableCell>
            <TableCell align="center" colSpan={1}>
              <strong>{totalCash.toFixed(2)}</strong>
            </TableCell>
          </TableRow>
          <TableRow className="bg-gray-200 border-y-0 border-none">
            <TableCell align="left" colSpan={5}>
              <strong>เงินโอน:</strong>
            </TableCell>
            <TableCell align="center" colSpan={1}>
              <strong>{totalTransfer.toFixed(2)}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
