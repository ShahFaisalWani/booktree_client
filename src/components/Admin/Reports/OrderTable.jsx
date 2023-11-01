import { forwardRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import { TableVirtuoso } from "react-virtuoso";

const columns = [
  {
    width: 30,
    label: "ที่",
    dataKey: "index",
    numeric: true,
  },
  {
    width: 70,
    label: "ISBN",
    dataKey: "ISBN",
  },
  {
    width: 120,
    label: "ชื่อ",
    dataKey: "title",
  },
  {
    width: 120,
    label: "ราคา",
    dataKey: "price",
    numeric: true,
  },
  {
    width: 120,
    label: "จำนวน",
    dataKey: "quantity",
    numeric: true,
  },
  {
    width: 120,
    label: "ส่วนลด",
    dataKey: "discount",
    numeric: true,
  },
  {
    width: 120,
    label: "รวม",
    dataKey: "total",
    numeric: true,
  },
];

const VirtuosoTableComponents = {
  Scroller: forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "center" : "left"}
          style={{ width: column.width }}
          sx={{
            backgroundColor: "background.paper",
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  return (
    <>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? "center" : "left"}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </>
  );
}

const OrderTable = ({ data }) => {
  const totalColumn = [
    {
      data: "รวม",
      numeric: true,
    },
    { data: "" },
    { data: "" },
    { data: "" },
    {
      data: totalQuantity,
      numeric: true,
    },
    {
      data: totalDiscount,
      numeric: true,
    },
    {
      data: totalSum,
      numeric: true,
    },
  ];
  function fixedFooterContent() {
    return (
      <TableRow>
        {totalColumn.map((column, i) => (
          <TableCell
            key={i}
            variant="head"
            align={column.numeric || false ? "center" : "left"}
            sx={{
              backgroundColor: "background.paper",
              borderTop: "1px solid #ddd",
            }}
          >
            {column.data}
          </TableCell>
        ))}
      </TableRow>
    );
  }
  return (
    <Paper style={{ height: 600, width: "100%" }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
        fixedFooterContent={fixedFooterContent}
      />
    </Paper>
    // <TableContainer component={Paper}>
    //   <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //     <TableHead>
    //       <TableRow className=" border-y-2 border-black">
    //         <TableCell>ที่</TableCell>
    //         <TableCell>ISBN</TableCell>
    //         <TableCell align="center">ชื่อ</TableCell>
    //         <TableCell align="center">ราคา</TableCell>
    //         <TableCell align="center">จำนวน</TableCell>
    //         <TableCell align="center">ส่วนลด</TableCell>
    //         <TableCell align="center">รวม</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {rows.map((row, i) => (
    //         <TableRow
    //           key={i}
    //           sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    //         >
    //           <TableCell>{i + 1}</TableCell>
    //           <TableCell component="th" scope="row">
    //             {row.ISBN}
    //           </TableCell>
    //           <TableCell align="center">{row.title}</TableCell>
    //           <TableCell align="center">{row.price.toFixed(2)}</TableCell>
    //           <TableCell align="center">{row.quantity}</TableCell>
    //           <TableCell align="center">{row.discount.toFixed(2)}</TableCell>
    //           <TableCell align="center">{row.total.toFixed(2)}</TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //     <TableFooter>
    //       <TableRow className="bg-gray-200 border-t-2 border-black">
    //         <TableCell align="left" colSpan={4}>
    //           <strong>ยอดรวม:</strong>
    //         </TableCell>
    //         <TableCell align="center" colSpan={1}>
    //           <strong>{totalQuantity}</strong>
    //         </TableCell>
    //         <TableCell align="center" colSpan={1}>
    //           <strong>{totalDiscount.toFixed(2)}</strong>
    //         </TableCell>
    //         <TableCell align="center" colSpan={1}>
    //           <strong>{totalSum.toFixed(2)}</strong>
    //         </TableCell>
    //       </TableRow>
    //       <TableRow className="bg-white">
    //         <TableCell align="left" colSpan={6}>
    //           <strong>เงินสด:</strong>
    //         </TableCell>
    //         <TableCell align="center" colSpan={1}>
    //           <strong>{totalCash.toFixed(2)}</strong>
    //         </TableCell>
    //       </TableRow>
    //       <TableRow className="bg-gray-200 border-y-0 border-none">
    //         <TableCell align="left" colSpan={6}>
    //           <strong>เงินโอน:</strong>
    //         </TableCell>
    //         <TableCell align="center" colSpan={1}>
    //           <strong>{totalTransfer.toFixed(2)}</strong>
    //         </TableCell>
    //       </TableRow>
    //     </TableFooter>
    //   </Table>
    // </TableContainer>
  );
};

export default OrderTable;
