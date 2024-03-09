import React, { useContext, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import MyModal from "../../MyModal";
import SupplierSelect from "../Books/SupplierSelect";
import toast from "react-hot-toast";
import { BookContext } from "../Books/Book";
import AddIcon from "@mui/icons-material/Add";

import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddExcel from "../Books/AddExcel";

const ReturnBooks = () => {
  const [bookList, setBookList] = useState(
    localStorage.getItem("returnCart")
      ? JSON.parse(localStorage.getItem("returnCart"))
      : []
  );
  const { supplier } = useContext(BookContext);

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState("");
  const [refNum, setRefNum] = useState("");
  const [deliveryDate, setdeliveryDate] = useState("");
  const excelRef = useRef(null);

  const calcQuantity = () => {
    let total = 0;
    bookList.map((book) => {
      total += parseInt(book.quantity) || 0;
    });
    return total;
  };

  const calcTotal = () => {
    let total = 0;
    bookList.map((book) => {
      total += book.price * book.quantity;
    });
    return total.toFixed(2);
  };

  const calcNetTotal = () => {
    const percent = 1 - parseInt(supplier.percent) / 100 || 0;
    return (calcTotal() * percent).toFixed(2);
  };

  const setBookListFunc = (data) => {
    setBookList(data);
    localStorage.setItem("returnCart", JSON.stringify(data));
  };

  const handleRemove = (ISBN) => {
    const newArray = bookList.filter((book) => book.ISBN !== ISBN);
    setBookListFunc(newArray);
  };

  const handleChange = (ISBN, amount) => {
    const newArray = bookList.map((book) => {
      if (book.ISBN === ISBN) {
        return { ...book, quantity: amount };
      }
      return book;
    });
    setBookListFunc(newArray);
  };

  const handleAddBookList = async (e) => {
    e.preventDefault();
    if (!supplier || supplier.supplier_name == "All")
      return toast.error("เลือก Supplier");
    setLoading(true);
    const addBookFunc = async () => {
      if (!e.target.ISBN.value) return;
      const ISBN = e.target.ISBN.value.trim();
      if (!/^\d+$/.test(ISBN)) return toast.error("ไม่มีสินค้า " + ISBN);

      const existingItemIndex = bookList.findIndex(
        (book) => book.ISBN === ISBN
      );
      if (existingItemIndex !== -1) {
        const updatedArray = bookList.map((book, index) => {
          if (index === existingItemIndex) {
            return {
              ...book,
              quantity: book.quantity ? parseInt(book.quantity) + 1 : 1,
            };
          } else {
            return book;
          }
        });

        setBookListFunc(updatedArray);
        return (document.getElementById("ISBN").value = "");
      }

      const res = await axios
        .get(import.meta.env.VITE_API_BASEURL + "/book/ISBN/" + ISBN)
        .catch((err) => console.log(err));

      let bookData =
        res?.data?.length > 0
          ? res.data[0].length > 0
            ? res.data[0][0]
            : res.data[1][0]
          : null;
      if (!bookData) {
        return toast.error("ไม่มีสินค้า " + ISBN);
      }
      if (bookData.supplier_name != supplier.supplier_name)
        return toast.error("Supplier ไม่สอดคล้อง");

      const newData = [
        ...bookList,
        {
          ...bookData,
          price: Math.floor(bookData.price),
          quantity: 1,
        },
      ];
      setBookListFunc(newData);
      return (document.getElementById("ISBN").value = "");
    };
    await addBookFunc();
    setLoading(false);
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    if (!type) return toast.error("เลือก รับ / คืน");
    if (type == "add") {
      if (!refNum || !deliveryDate) {
        return toast.error("ใส่ข้อมูลให้ครบ");
      }
    }
    if (!supplier || supplier.supplier_name == "All") {
      return toast.error("เลือก Supplier");
    }

    let hasInvalidValue = false;

    bookList.forEach((book) => {
      if (type == "return" && book.quantity > book.in_stock) {
        toast.error(
          "มี " +
            book.title?.substring(0, 15) +
            " แค่ " +
            book.in_stock +
            " ในสต็อก"
        );
        hasInvalidValue = true;
      } else if (book.quantity == "") {
        toast.error("ใส่จำนวนให้ครบ");
        hasInvalidValue = true;
      } else if (book.supplier_name != supplier.supplier_name) {
        toast.error(book.title?.substring(0, 15) + " ผิด Supplier");
        hasInvalidValue = true;
      }
    });

    try {
      if (!hasInvalidValue) {
        setLoading(true);
        const res = await axios.post(
          import.meta.env.VITE_API_BASEURL + "/stock/restock",
          { type: type, refId: refNum, deliveryDate: deliveryDate }
        );
        const resId = res.data;

        const data = bookList.map((stock) => ({
          ...stock,
          book_ISBN: stock.ISBN,
          restock_id: resId,
          type: type,
        }));

        await axios
          .post(import.meta.env.VITE_API_BASEURL + "/stock/restockDetail", data)
          .then(() => {
            toast.success("สำเร็จ");
            const modalData = {
              id: resId,
              supplier: supplier,
              stockList: bookList,
            };
            setBookListFunc([]);
            setOpenModal(modalData);
          });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const printBoxPaper = () => {
    const html = `
    <div style="margin-inline: auto; padding-top: 1em; width: 80%; margin-block: auto;">
        <div style="margin-bottom: 1em">
            <h2>
                ผู้รับ
            </h2>
            <h3 style="margin-left: 1em">
                <p style="margin-block: 0px;">${supplier.full_name}</p>
                <p style="margin-block: 0px;">${supplier.address}</p>
            </h3>
        </div>
        <div>
            <h3 style="margin-left: 1.5em">
                เลขที่อ้างอิง: ${openModal.id}
            </h3>
        </div>
        <div>
            <h2>
                ผู้ส่ง
            </h2>
            <h3 style="margin-left: 1em">
                <p style="margin-block: 0px;">ร้านหนังสือบุ๊คทรี</p>
                <p style="margin-block: 0px;">19 หมู่ 2 ต.บางนายสี อ.ตะกัวป่า จ.พังงา 82110 โทร.099-1915521</p>
            </h3>
        </div>
    </div>`;

    // Style for printing in landscape mode with larger fonts
    const printStyles = `
        <style>
            @media print {
                body {
                    width: 100%;
                    font-size: 20pt; /* Adjust font size as needed */
                    margin: 10mm; /* Adjust margin as needed */
                }
                @page {
                    size: A4 landscape;
                    margin: 10mm; /* Adjust margin as needed */
                }
            }
        </style>
    `;

    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);

    iframe.style.display = "none";
    iframe.contentDocument.open();
    iframe.contentDocument.write("<html><head><title>Print</title>");
    iframe.contentDocument.write(printStyles);
    iframe.contentDocument.write("</head><body>");
    iframe.contentDocument.write(html);
    iframe.contentDocument.write("</body></html>");
    iframe.contentDocument.close();

    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  function dataToHTMLTable(data) {
    let html =
      '<table style="width: 100%; border-collapse: collapse; border: none; font-size: 13px;">';

    data.forEach((row, i) => {
      html += "<tr>";
      let colspanEndIndex = null;

      ["A", "B", "C", "D", "E", "F"].forEach((col, index, array) => {
        if (row.colspanStart === col && row.colspan) {
          colspanEndIndex = index + parseInt(row.colspan);
          html += `<td colspan="${row.colspan}" style="border: none;">${
            row[col] || ""
          }</td>`;
        } else if (
          (colspanEndIndex === null || index >= colspanEndIndex) &&
          i < 3
        ) {
          html += `<td style="border: none;${
            ["A", "B", "C", "D", "E", "F"].includes(col)
              ? " text-align: left;"
              : ""
          } padding: 5px;">${row[col] || ""}</td>`;
        } else if (
          (colspanEndIndex === null || index >= colspanEndIndex) &&
          col == "C"
        ) {
          html += `<td style="border: 1px solid black;${
            ["C", "D", "E", "F"].includes(col) ? " text-align: left;" : ""
          } padding: 5px;">${row[col] || ""}</td>`;
        } else if (colspanEndIndex === null || index >= colspanEndIndex) {
          html += `<td style="border: 1px solid black;${
            ["C", "D", "E", "F"].includes(col) ? " text-align: center;" : ""
          } padding: 5px;">${row[col] || ""}</td>`;
        }
      });

      html += "</tr>";
    });

    html += "</table>";
    return html;
  }

  const createExcelData = (modalData) => {
    const extraRows = [
      {
        A: "ร้านหนังสือบุ๊คทรี",
        colspanStart: "A",
        colspan: "2",
        C: "",
        D: "",
        E: "",
        F: "ใบส่งคืน",
      },
      {
        A: "19 ม.2 ต.บางนายสี อ.ตะกั่วป่า จ.พังงา 82110 โทร. 095-0259234",
        colspanStart: "A",
        colspan: "3",
        D: "",
        E: "เลขที่เอกสาร",
        F: modalData.id,
      },
      {
        A: "",
        B: modalData.supplier.full_name,
        colspanStart: "B",
        colspan: "2",
        E: "วันที่เอกสาร",
        F: new Date().toLocaleDateString("th-TH"),
      },
    ];

    let quantitySum = 0;
    let totalSum = 0;
    let subtract = 0;
    modalData?.stockList.map((stock) => {
      quantitySum += parseInt(stock.quantity);
      totalSum += stock.price * stock.quantity;
    });
    subtract = totalSum * (parseInt(supplier.percent) / 100);

    const data = [
      ...extraRows,
      {
        A: "ลำดับ",
        B: "บาร์โค้ด",
        C: "ชื่อหนังสือ",
        D: "จำนวน",
        E: "ราคา/หน่วย",
        F: "รวมทั้งหมด",
      },
      ...modalData?.stockList.map((stock, i) => ({
        A: i + 1,
        B: stock.ISBN,
        C: stock.title,
        D: stock.quantity,
        E: stock.price.toFixed(2),
        F: (stock.price * stock.quantity).toFixed(2),
      })),
      {
        A: "",
        B: "",
        C: "",
        D: quantitySum,
        E: "เล่ม",
        F: totalSum.toFixed(2),
      },
      {
        A: "",
        B: "",
        C: "",
        D: "",
        E: `หัก ${modalData.supplier.percent}%`,
        F: subtract.toFixed(2),
      },
      {
        A: "",
        B: "",
        C: "",
        D: "",
        E: "รวมทั้งหมด",
        F: (totalSum - subtract).toFixed(2),
      },
    ];
    return data;
  };
  const printList = () => {
    const data = createExcelData(openModal);

    const html = dataToHTMLTable(data);
    const iframe = document.createElement("iframe");

    document.body.appendChild(iframe);

    iframe.style.display = "none";
    iframe.contentDocument.open();
    iframe.contentDocument.write(
      "<html><head><title>Print</title></head><body>"
    );
    iframe.contentDocument.write(html);
    iframe.contentDocument.write("</body></html>");
    iframe.contentDocument.close();

    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  const clickAddExcel = () => {
    setType("add");
    excelRef.current.openFileInput();
  };

  const addExcelFunc = (books) => {
    const newBooks = books.map((book) => {
      return {
        ...book,
        supplier_name: book.supplier_name || supplier.supplier_name,
      };
    });
    setBookList((prev) => [...prev, ...newBooks]);
  };
  const clearBookList = () => {
    setBookListFunc([]);
  };

  return (
    <>
      <div className="">
        <div className="flex m-auto items-center justify-around w-1/2 ">
          <button
            onClick={clickAddExcel}
            className={`flex border justify-center items-center gap-1 p-2 rounded-lg h-14 transition-all ${
              !supplier || supplier.supplier_name == "All"
                ? "text-gray-400 hover:bg-none"
                : "bg-green-500 text-white hover:bg-green-700"
            }`}
            disabled={!supplier || supplier.supplier_name == "All"}
          >
            <AddIcon />
            รับ Excel
          </button>
          <div className="flex gap-3">
            <div className="w-[300px]">
              <SupplierSelect />
            </div>
            <p className="border-2 px-4 py-3 rounded-[0.25rem]">
              {" "}
              {supplier.percent}%
            </p>
          </div>
          <button
            className={`flex border justify-center items-center gap-1 p-2 rounded-lg h-14 transition-all text-white ${
              bookList.length == 0
                ? "bg-gray-300"
                : "bg-red-500 hover:bg-red-700"
            }`}
            onClick={clearBookList}
            disabled={bookList.length == 0}
          >
            ลบทั้งหมด
          </button>
        </div>
        <div>
          <AddExcel
            ref={excelRef}
            onChange={(books) => {
              addExcelFunc(books);
            }}
          />
        </div>
      </div>
      <div className="mt-16 px-16">
        <table className="w-full">
          <thead>
            <tr className="flex gap-5 pb-4">
              <th className="text-left w-[2.5%]">ที่</th>
              <th className="text-left w-[15%]">ISBN</th>
              <th className="text-left w-[30%]">ชื่อ</th>
              <th className="text-center w-[8.5%]">ต่อหน่วย</th>
              <th className="text-center w-[8.5%]">สต็อก</th>
              <th className="text-center w-[8.5%]">จำนวน</th>
              <th className="text-center w-[8.5%]">รวม</th>
              <th className="text-center w-[8.5%]">หลังหัก %</th>
              <th className="text-center w-[2.5%]">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {bookList?.map((book, i) => (
              <tr key={book.ISBN} className="flex gap-5 items-center pb-2">
                <td className="w-[2.5%] text-left">{i + 1}</td>
                <td className="w-[15%] text-left">{book.ISBN}</td>
                <td className="w-[30%] text-left">
                  {book.title?.length > 50
                    ? book.title?.substring(0, 50) + "..."
                    : book.title}
                </td>
                <td className="w-[8.5%] text-center">
                  {book.price.toFixed(2)}
                </td>
                <td className="w-[8.5%] text-center">{book.in_stock}</td>
                <td className="flex w-[8.5%] text-center items-center justify-around">
                  <input
                    className="w-14 h-[2rem] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    min={1}
                    name="quantity"
                    value={book.quantity}
                    onChange={(e) => {
                      handleChange(book.ISBN, e.target.value);
                    }}
                  />
                </td>
                <td className="w-[8.5%] text-center">
                  {(book.price * book.quantity).toFixed(2)}
                </td>
                <td className="w-[8.5%] text-center">
                  {(
                    book.price *
                    book.quantity *
                    (1 - parseInt(supplier.percent) / 100)
                  ).toFixed(2)}
                </td>
                <td className="w-[2.5%] text-center">
                  <DeleteIcon
                    sx={{ color: "red" }}
                    onClick={() => handleRemove(book.ISBN)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleAddBookList} className="mt-2 px-16">
        <div className="flex gap-5 pb-4">
          <div className="text-left w-[2.5%]"></div>
          <div className="text-left w-[15%]">
            <input
              type="text"
              placeholder="ISBN"
              id="ISBN"
              name="ISBN"
              className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-2 py-1 max-w-[85%]"
            />
            <button type="submit" className="hidden">
              เพิ่ม
            </button>
          </div>
          <div className="text-left w-[30%]"></div>
          <div className="text-center w-[8.5%]"></div>
          <div className="text-center w-[8.5%]"></div>
          <div className="text-center w-[8.5%] text-2xl">{calcQuantity()}</div>
          <div className="text-center w-[8.5%] text-2xl">{calcTotal()}</div>
          <div className="text-center w-[8.5%] text-2xl bg-green-500 text-white">
            {calcNetTotal()}
          </div>
          <div className="text-center w-[2.5%]"></div>
        </div>
      </form>
      {bookList.length > 0 && (
        <div className="flex flex-col items-center gap-5 p-5 border-2 m-auto w-1/4 rounded-lg">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">รับ / เพิ่ม</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="รับ / เพิ่ม"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value={"add"}>รับ</MenuItem>
                <MenuItem value={"return"}>คืน</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {type && (
            <input
              name="refNum"
              className="border border-gray-500 placeholder-gray-400 p-2 py-1"
              placeholder="เลขที่อ้างอิง"
              value={refNum}
              onChange={(e) => setRefNum(e.target.value)}
            />
          )}
          {type == "add" && (
            <>
              <input
                name="deliverDate"
                type="date"
                className="border border-gray-500 placeholder-gray-400 p-2 py-1"
                placeholder="วันที่ส่งสินค้า"
                value={deliveryDate}
                onChange={(e) => setdeliveryDate(e.target.value)}
              />
            </>
          )}
          <button
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleReturn}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                style={{
                  color: "white",
                }}
                size={20}
              />
            ) : (
              <p>{type == "return" ? "ยืนยันการคืน" : "ยืนยันการรับ"}</p>
            )}
          </button>
        </div>
      )}
      {openModal && (
        <MyModal
          onClose={() => setOpenModal(false)}
          children={
            <div>
              <h2 className="text-center py-5">
                เลขที่อ้างอิง: {openModal.id}
              </h2>
              {type == "return" ? (
                <div className="flex justify-center gap-5">
                  <button
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={printBoxPaper}
                  >
                    ปริ้นใบแปะหน้ากล่อง
                  </button>
                  <button
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={printList}
                  >
                    ปริ้นรายละเอียดการคืนรายเล่ม
                  </button>
                </div>
              ) : (
                <div className="flex justify-center gap-5">
                  <p className="w-fit text-green-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-3xl px-5 py-2.5 text-center">
                    รับสำเร็จ
                  </p>
                </div>
              )}
            </div>
          }
        />
      )}
    </>
  );
};

export default ReturnBooks;
