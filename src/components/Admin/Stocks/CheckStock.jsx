import axios from "axios";
import React, { useRef, useState } from "react";
import LoadingScreen from "../../Loading/LoadingScreen";
import jsPDF from "jspdf";
import "./THSarabunNew-normal";
import "./THSarabunNew Bold-normal.js";
import PrintIcon from "@mui/icons-material/Print";
import { toast } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";

const CheckStock = () => {
  const btnRef = useRef();
  const inputRef = useRef();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBooks([]);
    const formData = new FormData();
    formData.append("excel_file", e.target.upload.files[0]);

    const res = await axios
      .post(import.meta.env.VITE_API_BASEURL + "/book/excel", formData)
      .catch((err) => {
        toast.error("File Error");
        setLoading(false);
      });
    if (!res) return (inputRef.current.value = "");

    const excelData = JSON.parse(res.data);

    let isEmpty = true;
    await Promise.all(
      excelData.map(async (book) => {
        const res = await axios.get(
          import.meta.env.VITE_API_BASEURL + "/book/ISBN/" + book.ISBN
        );
        if (res.data[0][0]?.in_stock > 0) {
          setBooks((prev) => [...prev, res.data[0][0]]);
          isEmpty = false;
        }
      })
    );

    if (isEmpty) toast.error("ไม่มีในสต็อก");
    if (inputRef.current) inputRef.current.value = "";
    setLoading(false);
  };

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
      pdf.setFontSize(pdfConfig.typo.normal);
      pdf.setTextColor("#000");
      pdf_position_y += 40;

      books.map((book, i) => {
        if (i != 0 && i % 8 == 0) {
          pdf.addPage();
          pdf_position_y = 40;
        }
        pdf.setFontSize(pdfConfig.typo.header);
        pdf_position_y -= 10;
        pdf.text(`${i + 1})`, 40, pdf_position_y + 20, null, null, "center");

        pdf.setFontSize(pdfConfig.typo.normal);

        pdf.text(`ISBN: ${book.ISBN}`, 60, pdf_position_y, null, null, "left");
        pdf_position_y += 20;
        pdf.setFont("THSarabunNew Bold", "normal");

        pdf.text(
          `เรื่อง: ${book.title}`,
          60,
          pdf_position_y,
          null,
          null,
          "left"
        );
        pdf_position_y += 20;
        pdf.setFont("THSarabunNew", "normal");
        pdf.text(
          `หมวด: ${book.genre} สต็อก: ${book.in_stock}`,
          60,
          pdf_position_y,
          null,
          null,
          "left"
        );

        pdf_position_y += 10;
        pdf.line(0, pdf_position_y, pdf_width, pdf_position_y);

        pdf_position_y += 30;
      });

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

  const ISBNsubmit = async (e) => {
    e.preventDefault();
    if (!e.target.ISBN.value) return;
    const ISBN = e.target.ISBN.value.trim();
    if (!/^\d+$/.test(ISBN)) return toast.error("ไม่มีหนังสือ " + ISBN);

    const existingItemIndex = books.findIndex((book) => book.ISBN === ISBN);

    if (existingItemIndex !== -1) {
      return toast.success("มีสินค้านี้แล้ว", {
        style: {
          color: "#a38405",
        },
        icon: null,
      });
    }
    setBtnLoading(true);
    const res = await axios.get(
      import.meta.env.VITE_API_BASEURL + "/book/ISBN/" + ISBN
    );

    let bookData =
      res?.data?.length > 0
        ? res.data[0].length > 0
          ? res.data[0][0]
          : res.data[1][0]
        : null;

    if (!bookData) {
      setBtnLoading(false);
      return toast.error(`ไม่มีหนังสือ ${ISBN}`);
    }

    setBooks((prev) => [bookData, ...prev]);
    setBtnLoading(false);
    return (document.getElementById("ISBN").value = "");
  };

  const handleRemove = (ISBN) => {
    const newData = books.filter((book) => book.ISBN !== ISBN);
    setBooks(newData);
  };

  return (
    <div>
      {loading && <LoadingScreen />}
      <div className="flex mb-10 w-fit m-auto gap-20">
        <form onSubmit={ISBNsubmit}>
          <div className="flex gap-5">
            <input
              type="text"
              placeholder="ISBN"
              id="ISBN"
              name="ISBN"
              className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-2 py-1"
            />
            <button
              type="submit"
              className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs w-full sm:w-auto p-2 text-center"
              disabled={btnLoading}
            >
              {btnLoading ? (
                <CircularProgress
                  sx={{ color: "white", fontSize: "10px" }}
                  size={25}
                />
              ) : (
                "เช็ค"
              )}
            </button>
          </div>
        </form>
        <form action="submit" onSubmit={handleSubmit}>
          <input
            type="file"
            name="upload"
            id="upload"
            ref={inputRef}
            onChange={() => btnRef.current.click()}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <div>
            <button ref={btnRef} type="submit" hidden />
          </div>
        </form>
      </div>

      {books.length > 0 && (
        <div className="flex flex-col justify-center">
          <div className="flex text-left">
            <button
              className="items-center text-white bg-blue-700 hover:bg-blue-800 px-20 py-2.5 text-center"
              onClick={handlePrint}
            >
              <p className="text-lg flex gap-3 justify-center items-center">
                Print <PrintIcon />
              </p>
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-black">
                <th className="border-0 text-left p-[8px] text-white">ISBN</th>
                <th className="border-0 text-left p-[8px] text-white">รูปปก</th>
                <th className="border-0 text-left p-[8px] text-white">
                  ชื่อสินค้า
                </th>
                <th className="border-0 text-left p-[8px] text-white">
                  หมวดหมู่
                </th>
                <th className="border-0 text-left p-[8px] text-white">ราคา</th>
                <th className="border-0 text-left p-[8px] text-white">สต็อก</th>
                <th className="border-0 text-left p-[8px] text-white">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {books?.map((item, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-gray-200" : ""}>
                  <td className="text-left p-[8px]">{item.ISBN}</td>
                  <td className="text-left p-[8px] h-36 w-24">
                    {item.cover_img ? (
                      <img
                        src={item.cover_img}
                        className="object-cover h-full w-full cursor-pointer"
                      />
                    ) : (
                      <div className="h-full w-24 text-white bg-gray-400 items-center flex justify-center">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="text-left p-[8px]">{item.title}</td>
                  <td className="text-left p-[8px]">{item.genre}</td>
                  <td className="text-left p-[8px]">{item.price}</td>
                  <td className="text-left p-[8px]">{item.in_stock}</td>
                  <td className="text-left p-[8px]">
                    <button
                      className="text-red-500"
                      onClick={() => handleRemove(item.ISBN)}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div id="printdiv" style={{ display: "none" }}>
        <h1>Printable Content</h1>
        <p>This is some content that will be printed on an A4 page.</p>
      </div>
    </div>
  );
};

export default CheckStock;
