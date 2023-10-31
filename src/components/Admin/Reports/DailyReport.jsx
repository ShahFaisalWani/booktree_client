import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import OrderTable from "./OrderTable";
import dayjs from "dayjs";
import LoadingScreen from "../../Loading/LoadingScreen";
import jsPDF from "jspdf";
import "../Stocks/THSarabunNew-normal";
import "../Stocks/THSarabunNew Bold-normal.js";

const DailyReport = () => {
  const currentDate = dayjs();
  const initialDateString = currentDate.format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(initialDateString);

  const orderObj = function (data) {
    return {
      ISBN: data.ISBN || "",
      title: data.title || "",
      price: parseFloat(data.price) || "",
      quantity: parseInt(data.quantity) || "",
      discount: parseFloat(data.discount),
      total: parseFloat(data.total),
    };
  };

  const updateOrPushOrder = (rows, order) => {
    const existingOrderIndex = rows.findIndex((row) => row.ISBN === order.ISBN);
    if (existingOrderIndex !== -1) {
      rows[existingOrderIndex].quantity += order.quantity;
      rows[existingOrderIndex].discount += order.discount;
      rows[existingOrderIndex].total += order.total;
    } else {
      rows.push(order);
    }
  };

  let url = "/order/date?date=" + dayjs(selectedDate).format("MM/DD/YYYY");
  useEffect(() => {
    url = "/order/date?date=" + dayjs(selectedDate).format("MM/DD/YYYY");
  }, [selectedDate]);

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, error, data } = useQuery(
    ["daily report", selectedDate],
    fetchMyData
  );

  const rows = [];
  let totalCash = 0;
  let totalTransfer = 0;
  let totalQuantity = 0;
  let totalDiscount = 0;
  let totalSum = 0;

  data &&
    Object.keys(data).map((item) => {
      if (
        data[item].order.payment === "cash" ||
        data[item].order.payment === "transfer"
      ) {
        for (let i = 0; i < Object.keys(data[item].order_details).length; i++) {
          updateOrPushOrder(rows, orderObj(data[item].order_details[i]));
          totalQuantity += parseFloat(data[item].order_details[i].quantity);
          totalDiscount += parseFloat(data[item].order_details[i].discount);
          totalSum += parseFloat(data[item].order_details[i].total);
        }
      }
      if (data[item].order.payment === "cash") {
        for (let i = 0; i < Object.keys(data[item].order_details).length; i++) {
          totalCash += data[item].order_details[i].total;
        }
      } else if (data[item].order.payment === "transfer") {
        for (let i = 0; i < Object.keys(data[item].order_details).length; i++) {
          totalTransfer += data[item].order_details[i].total;
        }
      }
    });

  function printPDF() {
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

  const handlePrint = () => {
    printPDF();
  };

  if (isLoading) return <LoadingScreen />;
  return (
    <div>
      <div className="flex justify-between items-center mb-10 px-10">
        <div className="flex items-center gap-5">
          <p>วันที่</p>
          <input
            name="deliverDate"
            type="date"
            className="border border-gray-500 placeholder-gray-400 p-2 py-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div>
          <button
            className={`items-center text-white ${
              rows.length == 0 ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"
            }  px-20 py-2.5 text-center`}
            onClick={handlePrint}
            disabled={rows.length == 0}
          >
            <p className="text-lg flex gap-3 justify-center items-center">
              Print
            </p>
          </button>
        </div>
      </div>
      <div className="px-10 text-center">
        <OrderTable
          rows={rows}
          totalCash={totalCash}
          totalTransfer={totalTransfer}
          totalQuantity={totalQuantity}
          totalDiscount={totalDiscount}
          totalSum={totalSum}
        />
      </div>
    </div>
  );
};

export default DailyReport;
