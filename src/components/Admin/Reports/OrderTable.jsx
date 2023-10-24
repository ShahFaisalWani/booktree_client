import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import { Box, Modal } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   height: "80%",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   px: 8,
//   py: 6,
// };

const OrderTable = ({ rows }) => {
  const totalSum = parseFloat(
    rows.reduce((sum, row) => sum + parseFloat(row.total), 0)
  ).toFixed(2);

  // const [open, setOpen] = useState(false);
  // const [currentRow, setCurrentRow] = useState(null);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
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
            <TableRow>
              <TableCell align="left" colSpan={2}>
                <strong>Total Sum:</strong>
              </TableCell>
              <TableCell align="center" colSpan={1}>
                <strong>{totalSum}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="overflow-auto">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-7 top-7 text-gray-400 hover:text-red-500"
          >
            <CloseIcon fontSize="medium" />
          </button>
          <div className="h-fit max-h-2/3 bg-white p-8 px-16 overflow-scroll">
            <table className="w-full border-collapse">
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
                  <th className="border-0 text-left p-[8px] text-white">
                    ส่วนลด
                  </th>
                  <th className="border-0 text-left p-[8px] text-white">รวม</th>
                </tr>
              </thead>
              <tbody>
                {currentRow?.map((item, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-gray-200" : ""}>
                    <td className="text-left p-[8px]">{item.ISBN}</td>
                    <td className="text-left p-[8px]">{item.title}</td>
                    <td className="text-left p-[8px]">{item.price}</td>
                    <td className="text-left p-[8px]">{item.quantity}</td>
                    <td className="text-left p-[8px]">
                      {parseFloat(item.discount).toFixed(2)}
                    </td>
                    <td className="text-left p-[8px]">
                      {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>
      </Modal> */}
    </>
  );
};

export default OrderTable;
