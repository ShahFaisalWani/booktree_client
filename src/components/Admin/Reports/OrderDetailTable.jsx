import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import { TableVirtuoso } from "react-virtuoso";
import jsPDF from "jspdf";

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

function printPDF(
  rows,
  totalQuantity,
  totalDiscount,
  totalSum,
  totalCash,
  totalTransfer
) {
  const pdfOption = {
    orientation: "p",
    format: "a4",
    unit: "px",
    lineHeight: 2,
    putOnlyUsedFonts: true,
  };

  const pdfConfig = {
    typo: {
      header: 25,
      large: 20,
      normal: 18,
      small: 14,
    },
    margin: {
      t: 20,
      b: 20,
      l: 20,
      r: 20,
    },
  };
  try {
    let pdf = new jsPDF(pdfOption);
    const pdf_width = pdf.internal.pageSize.width;
    const pdf_height = pdf.internal.pageSize.height;
    const margin_l = pdfConfig.margin.l;
    let pdf_position_y = 0;
    pdf.setFont("THSarabunNew", "normal");
    pdf.setTextColor("#000");
    pdf_position_y += 40;

    const ISBN_w = 40;
    const title_w = ISBN_w + 80;
    const price_w = title_w + 110;
    const quantity_w = price_w + 50;
    const discount_w = quantity_w + 50;
    const total_w = discount_w + 50;

    pdf.setFontSize(pdfConfig.typo.small);
    pdf.text("ISBN", ISBN_w, pdf_position_y, null, null, "left");
    pdf.text("ชื่อ", title_w, pdf_position_y, null, null, "left");
    pdf.text("ราคา", price_w, pdf_position_y, null, null, "left");
    pdf.text("จำนวน", quantity_w, pdf_position_y, null, null, "left");
    pdf.text("ส่วนลด", discount_w, pdf_position_y, null, null, "left");
    pdf.text("รวม", total_w, pdf_position_y, null, null, "left");
    pdf_position_y += 20;

    rows.map((book, i) => {
      if (i != 0 && i % 48 == 0) {
        pdf.addPage();
        pdf_position_y = 40;
      }
      pdf.text(`${book.ISBN}`, ISBN_w, pdf_position_y, null, null, "left");
      pdf.text(
        `${
          book?.title?.length > 30
            ? book?.title?.substring(0, 27) + "..."
            : book?.title
        }`,
        title_w,
        pdf_position_y,
        null,
        null,
        "left"
      );
      pdf.text(
        `${book.price.toFixed(2)}`,
        price_w,
        pdf_position_y,
        null,
        null,
        "left"
      );
      pdf.text(
        `${book.quantity}`,
        quantity_w,
        pdf_position_y,
        null,
        null,
        "left"
      );
      pdf.text(
        `${book.discount.toFixed(2)}`,
        discount_w,
        pdf_position_y,
        null,
        null,
        "left"
      );
      pdf.text(
        `${book.total.toFixed(2)}`,
        total_w,
        pdf_position_y,
        null,
        null,
        "left"
      );
      pdf_position_y += 15;
    });
    pdf_position_y += 10;

    pdf.text("ยอดรวม", ISBN_w, pdf_position_y, null, null, "left");
    pdf.text(
      `${totalQuantity}`,
      quantity_w,
      pdf_position_y,
      null,
      null,
      "left"
    );
    pdf.text(
      `${totalDiscount.toFixed(2)}`,
      discount_w,
      pdf_position_y,
      null,
      null,
      "left"
    );
    pdf.text(
      `${totalSum.toFixed(2)}`,
      total_w,
      pdf_position_y,
      null,
      null,
      "left"
    );
    pdf_position_y += 15;

    pdf.text("เงินสด", ISBN_w, pdf_position_y, null, null, "left");
    pdf.text(
      `${totalCash.toFixed(2)}`,
      total_w,
      pdf_position_y,
      null,
      null,
      "left"
    );
    pdf_position_y += 15;

    pdf.text("เงินโอน", ISBN_w, pdf_position_y, null, null, "left");
    pdf.text(
      `${totalTransfer.toFixed(2)}`,
      total_w,
      pdf_position_y,
      null,
      null,
      "left"
    );

    setTimeout(() => {
      const textDate = new Date().toString();
      pdf.setFont("THSarabunNew", "normal");
      pdf.setFontSize(pdfConfig.typo.small);
      const pages = pdf.internal.getNumberOfPages();
      for (let j = 1; j < pages + 1; j++) {
        pdf.setPage(j);
        pdf.text(
          `วันเวลา : ${textDate}`,
          margin_l,
          pdf_height - 15,
          null,
          null,
          "left"
        );
        pdf.text(
          `หน้า ${j} จาก ${pages}`,
          pdf_width - margin_l,
          pdf_height - 15,
          null,
          null,
          "right"
        );
      }
      window.open(pdf.output("bloburl"), "_blank");
    }, 0);
  } catch (err) {
    console.log(err);
  }
}

const OrderDetailTable = forwardRef((props, ref) => {
  const { data } = props;

  const [rows, setRows] = useState([]);
  const [totalCash, setTotalCash] = useState(0);
  const [totalTransfer, setTotalTransfer] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  useImperativeHandle(ref, () => ({
    handlePrint() {
      printPDF(
        rows,
        totalQuantity,
        totalDiscount,
        totalSum,
        totalCash,
        totalTransfer
      );
    },
  }));

  let index = 0;

  function orderObj(data) {
    ++index;
    return {
      index: index,
      ISBN: data.ISBN || "",
      title: data.title || "",
      price: parseFloat(data.price) || "",
      quantity: parseInt(data.quantity) || "",
      discount: parseFloat(data.discount),
      total: parseFloat(data.total),
    };
  }

  const updateOrPushOrder = (rows, setRows, order) => {
    const existingOrderIndex = rows.findIndex((row) => row.ISBN === order.ISBN);
    if (existingOrderIndex !== -1) {
      rows[existingOrderIndex].quantity += order.quantity;
      rows[existingOrderIndex].discount += order.discount;
      rows[existingOrderIndex].total += order.total;
    } else {
      setRows((prev) => [...prev, order]);
    }
  };

  useEffect(() => {
    if (!data) return;
    let total_q = 0;
    let total_d = 0;
    let total_s = 0;
    let total_cash = 0;
    let total_transfer = 0;
    Object.keys(data).map((item, i) => {
      if (
        data[item].order.payment === "cash" ||
        data[item].order.payment === "transfer"
      ) {
        for (let i = 0; i < Object.keys(data[item].order_details).length; i++) {
          updateOrPushOrder(
            rows,
            setRows,
            orderObj(data[item].order_details[i])
          );
          total_q += parseInt(data[item].order_details[i].quantity);
          total_d += parseFloat(data[item].order_details[i].discount);
          total_s += parseFloat(data[item].order_details[i].total);
        }
      }

      if (data[item].order.payment === "cash") {
        for (let i = 0; i < Object.keys(data[item].order_details).length; i++) {
          total_cash += data[item].order_details[i].total;
        }
      } else if (data[item].order.payment === "transfer") {
        for (let i = 0; i < Object.keys(data[item].order_details).length; i++) {
          total_transfer += data[item].order_details[i].total;
        }
      }

      setTotalQuantity(total_q);
      setTotalDiscount(total_d);
      setTotalSum(total_s);
      setTotalCash(total_cash);
      setTotalTransfer(total_transfer);
    });
  }, [data]);

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
  );
});

export default OrderDetailTable;
