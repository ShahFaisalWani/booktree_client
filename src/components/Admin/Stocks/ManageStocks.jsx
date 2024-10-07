import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";
import LoadingScreen from "../../Loading/LoadingScreen";
import OrderSupplier from "../../../services/OrderSupplier";
import { render } from "@react-email/render";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  height: "fit",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
};

function dataToHTMLTable(data) {
  let html =
    '<table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: 13px;">';

  data.forEach((row) => {
    html += "<tr>";
    ["A", "B", "C", "D", "E", "F"].forEach((col) => {
      if (["C", "D", "E", "F"].includes(col)) {
        html += `<td style="border: 1px solid black; text-align: center; padding: 5px;">${
          row[col] || ""
        }</td>`;
      } else {
        html += `<td style="border: 1px solid black;">${row[col] || ""}</td>`;
      }
    });
    html += "</tr>";
  });

  html += "</table>";
  return html;
}

const createExcelData = (modalData) => {
  const isAdd = modalData.type == "add";
  const isRestock = modalData.type == "restock";
  const extraRows = [
    { A: "เลขที่อ้างอิง:", B: modalData?.id },
    {
      A: "ตัวแทนจำหน่าย:",
      B: modalData?.supplier?.supplier_name,
      C: "",
      D: "",
      E: "",
      F: modalData?.supplier?.percent + "%",
    },
  ];
  const addStockRows = isAdd
    ? [
        { A: "เลขที่อ้างอิงจากตัวแทนจำหน่าย:", B: modalData?.refNum },
        { A: "วันที่ส่งสินค้า:", B: modalData?.deliveryDate },
      ]
    : [{}];

  let quantitySum = 0;
  let totalSum = 0;
  let netSum = 0;
  modalData?.stockList.map((stock) => {
    quantitySum += stock.quantity;
    totalSum += stock.price * stock.quantity;
    netSum +=
      stock.price * stock.quantity * (1 - modalData?.supplier?.percent / 100);
  });

  const data = [
    ...extraRows,
    ...addStockRows,
    {},
    {
      A: "ISBN",
      B: "ชื่อ",
      C: "ราคา",
      D: isRestock ? "ปรับ" : "จำนวน",
      E: isRestock ? "จำนวน" : "รวม",
      F: isRestock ? "รวม" : "หลังหัก %",
      G: isRestock ? "หลังหัก %" : "",
    },
    ...modalData?.stockList.map((stock) => ({
      A: stock.ISBN,
      B: stock.title,
      C: stock.price,
      D: isRestock ? (stock.type == "add" ? "รับ" : "คืน") : stock.quantity,
      E: isRestock ? stock.quantity : (stock.price * stock.quantity).toFixed(2),
      F: isRestock
        ? (stock.price * stock.quantity).toFixed(2)
        : (
            stock.price *
            stock.quantity *
            (1 - modalData?.supplier?.percent / 100)
          ).toFixed(2),
      G: isRestock
        ? (
            stock.price *
            stock.quantity *
            (1 - modalData?.supplier?.percent / 100)
          ).toFixed(2)
        : "",
    })),
    {
      C: isRestock ? "" : "รวม",
      D: isRestock ? "รวม" : quantitySum,
      E: isRestock ? quantitySum : totalSum.toFixed(2),
      F: isRestock ? totalSum.toFixed(2) : netSum.toFixed(2),
      G: isRestock ? netSum.toFixed(2) : "",
    },
  ];
  return data;
};

export const handleExport = (modalData) => {
  const data = createExcelData(modalData);

  const ws = XLSX.utils.json_to_sheet(data, {
    header: ["A", "B", "C"],
    skipHeader: true,
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stocks");

  XLSX.writeFile(wb, modalData?.id + ".xlsx");
};

export function printData(modalData) {
  const data = createExcelData(modalData);

  const html = dataToHTMLTable(data);
  const iframe = document.createElement("iframe");

  document.body.appendChild(iframe);

  iframe.style.display = "none";
  iframe.contentDocument.open();
  iframe.contentDocument.write("<html><head><title>Print</title></head><body>");
  iframe.contentDocument.write(html);
  iframe.contentDocument.write("</body></html>");
  iframe.contentDocument.close();

  iframe.contentWindow.print();
  document.body.removeChild(iframe);
}

export const StockSuccessModal = ({ modalData, openDone, handleClose }) => {
  return (
    <Modal
      open={openDone}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="">
          <p className="flex flex-col text-lg absolute left-14 top-7 text-black">
            <span>
              เลขที่อ้างอิง: <b>{modalData?.id}</b>
            </span>
            <span>
              ตัวแทนจำหน่าย: <b>{modalData?.supplier?.supplier_name}</b>
            </span>
            {modalData?.refNum && (
              <span>
                เลขที่อ้างอิงจากตัวแทนจำหน่าย: <b>{modalData?.refNum}</b>
              </span>
            )}
            {modalData?.deliveryDate && (
              <span>
                วันที่ส่งสินค้า: <b>{modalData?.deliveryDate}</b>
              </span>
            )}
          </p>
          <button
            onClick={handleClose}
            className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
          >
            <CloseIcon fontSize="medium" />
          </button>
          <div className="flex justify-center items-center p-16 mt-28">
            <table className="w-full">
              <thead>
                <tr className="flex gap-5 pb-4">
                  <th className="text-left w-1/4">ISBN</th>
                  <th className="text-left w-1/2">ชื่อ</th>
                  <th className="text-center w-1/4">จำนวน</th>
                </tr>
              </thead>
              <tbody className="block max-h-[500px] overflow-y-scroll">
                {modalData?.stockList?.map((stock) => (
                  <tr key={stock.ISBN} className="flex gap-5 items-center pb-2">
                    <td className="w-1/4 text-left">{stock.ISBN}</td>
                    <td className="w-1/2 text-left">{stock.title}</td>
                    <td className="w-1/4 text-center">{stock.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pb-5 text-center w-full">
            <button
              className="text-white bg-blue-700 hover:bg-blue-700 font-medium rounded-lg text-md w-full sm:w-auto p-2 text-center"
              type="button"
              onClick={() => handleExport(modalData)}
            >
              Export
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

function workbookToFile(wb) {
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  return blob;

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
}

const orderExcel = async (modalData) => {
  // Header information
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
  const year = today.getFullYear() + 543; // Convert to Thai year

  const thaiDate = `${day}/${month}/${year}`;

  const headerRows = [
    {
      A: "ร้านหนังสือบุ๊คทรี",
      B: "",
      C: "",
      D: "",
      E: "",
      F: "ใบสั่งสินค้า",
    },
    {
      A: "19  ม. 2  ต.  บางนายสี   อ.ตะกั่วป่า   จ. พังงา  82110   โทร. 076-471499",
      B: "",
      C: "",
      D: "",
      E: "เลขที่เอกสาร",
      F: modalData?.id,
    },
    {
      A: "บริษัท อมรินทร์ บุ๊คเซ็นเตอร์ จำกัด",
      B: "",
      C: "",
      D: "",
      E: "วันที่เอกสาร",
      F: thaiDate,
    },
    {},
  ];

  // Table headers
  const tableHeaders = [
    {
      A: "ลำดับ",
      B: "บาร์โค้ด",
      C: "ชื่อ",
      D: "ราคา",
      E: "จำนวนสั่ง",
      F: "รวม",
    },
  ];

  // Convert stockList to table rows
  const stockRows = modalData?.stockList.map((stock, index) => ({
    A: index + 1,
    B: stock.ISBN,
    C: stock.title,
    D: stock.price,
    E: stock.quantity,
    F: stock.price * stock.quantity,
  }));

  // Total Rows
  const totalRows = [
    {
      E: "รวม",
      F: modalData?.stockList.reduce(
        (sum, stock) => sum + stock.price * stock.quantity,
        0
      ),
    },
    {
      E: "หัก 25%",
      F: modalData?.stockList.reduce(
        (sum, stock) => sum + stock.price * stock.quantity * 0.25,
        0
      ),
    },
    {
      E: "รวมทั้งหมด",
      F: modalData?.stockList.reduce(
        (sum, stock) => sum + stock.price * stock.quantity * 0.75,
        0
      ),
    },
  ];

  // Combine all data
  const data = [...headerRows, ...tableHeaders, ...stockRows, ...totalRows];

  // Create worksheet and workbook and save
  const ws = XLSX.utils.json_to_sheet(data, {
    header: ["A", "B", "C"],
    skipHeader: true,
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stocks");

  const excelFile = workbookToFile(wb);

  const emailObj = render(
    <OrderSupplier supplier={modalData?.supplier} date={thaiDate} />
  );
  const formData = new FormData();
  formData.append("supplier_email", modalData?.supplier.sales_email);
  formData.append("email_obj", emailObj);
  formData.append("excel_file", excelFile);
  formData.append("order_id", modalData?.id);

  //TODO:send email to supplier
  // await axios
  //   .post(import.meta.env.VITE_API_BASEURL + `/email/ordersupplier`, formData)
  //   .then((res) => {
  //     toast.success("ส่งเมลสำเร็จ");
  //   })
  //   .catch((err) => {
  //     toast.error("ส่งเมลไม่สำเร็จ");
  //     console.log(err);
  //   });
};

const ManageStocks = ({
  type,
  supplier,
  closeModal,
  onFinish,
  rowSelectionModel,
}) => {
  const [refNum, setRefNum] = useState("");
  const [deliveryDate, setdeliveryDate] = useState("");
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStockList(rowSelectionModel);
  }, [rowSelectionModel]);

  const handleChange = (ISBN, amount) => {
    const newArray = stockList.map((stock) => {
      if (stock.ISBN === ISBN) {
        return { ...stock, quantity: parseInt(amount) };
      }
      return stock;
    });
    setStockList(newArray);
  };

  const handleRemove = (ISBN) => {
    const newArray = stockList.filter((book) => book.ISBN !== ISBN);
    setStockList(newArray);
  };

  const handleAddStocks = async (e) => {
    e.preventDefault();
    let hasError = false;
    if (type && stockList.length > 0) {
      hasError = stockList.some((stock) => {
        return (
          typeof stock.quantity !== "number" ||
          isNaN(stock.quantity) ||
          stock.quantity <= 0
        );
      });
      if (hasError) return toast.error("ใส่จำนวนให้ครบถ้วน");

      if (!hasError) {
        setLoading(true);
        const res = await axios.post(
          import.meta.env.VITE_API_BASEURL + "/stock/restock",
          { type: type, refId: refNum, deliveryDate: deliveryDate }
        );
        const resId = res.data;

        const data = stockList.map((stock) => ({
          ...stock,
          book_ISBN: stock.ISBN,
          restock_id: resId,
        }));

        await axios
          .post(import.meta.env.VITE_API_BASEURL + "/stock/restockDetail", data)
          .then(() => {
            toast.success("สำเร็จ");
            const modalData = {
              id: resId,
              supplier: supplier,
              stockList: stockList,
              refNum: refNum || "",
              deliveryDate: deliveryDate || "",
              type: type,
            };
            if (onFinish) onFinish(modalData);
            if (type == "order") {
              // orderExcel(modalData);
            }
            setStockList([]);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const totalQuantity = stockList.reduce(
    (sum, stock) => sum + (stock.quantity || 0),
    0
  );
  const totalPrice = stockList.reduce(
    (sum, stock) => sum + stock.price * (stock.quantity || 0),
    0
  );
  const totalNet = totalPrice * (1 - supplier?.percent / 100);

  return (
    <div className="">
      {loading && <LoadingScreen />}
      <div className="py-5 px-10 text-blue-600 text-xl border-b-2 border-gray-300">
        <div className="flex gap-5 mb-3 items-center">
          <p>
            {type == "order"
              ? "สั่งสินค้า"
              : type == "add"
              ? "รับสินค้า"
              : "คืนสินค้า"}
            {": "}
            {supplier?.supplier_name}
          </p>
          <p>{supplier?.percent}%</p>
          {type == "add" && (
            <>
              <input
                name="refNum"
                className="border border-gray-500 placeholder-gray-400 p-2 py-1"
                placeholder="เลขที่อ้างอิง"
                value={refNum}
                onChange={(e) => setRefNum(e.target.value)}
              />
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
        </div>
      </div>
      <button
        onClick={() => closeModal()}
        className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
      >
        <CloseIcon fontSize="medium" />
      </button>
      <div className="flex justify-center items-center px-16 py-8 w-full">
        <form onSubmit={handleAddStocks}>
          <table className="mb-8 w-[70vw]">
            <thead>
              <tr className="flex gap-5 pb-4">
                <th className="text-left w-[5%]"></th>
                <th className="text-left w-[15%]"></th>
                <th className="text-left w-[30%]"></th>
                <th className="text-center w-[10%]">รวม</th>
                <th className="text-center w-[10%]">{totalQuantity}</th>
                <th className="text-center w-[10%]">{totalPrice.toFixed(2)}</th>
                <th className="text-center w-[10%]">{totalNet.toFixed(2)}</th>
                <th className="text-center w-[10%]"></th>
              </tr>
              <tr className="flex gap-5 pb-4">
                <th className="text-left w-[5%]">ที่</th>
                <th className="text-left w-[15%]">ISBN</th>
                <th className="text-left w-[30%]">ชื่อ</th>
                <th className="text-center w-[10%]">ราคา</th>
                <th className="text-center w-[10%]">จำนวน</th>
                <th className="text-center w-[10%]">รวม</th>
                <th className="text-center w-[10%]">หลังหัก%</th>
                <th className="text-center w-[10%]">ลบ</th>
              </tr>
            </thead>
            <tbody className="block max-h-[500px] overflow-y-scroll w-full ">
              {stockList?.map((stock, i) => (
                <tr key={stock.ISBN} className="flex gap-5 items-center pb-2">
                  <td className="w-[5%] text-left">{i + 1}</td>
                  <td className="w-[15%] text-left">{stock.ISBN}</td>
                  <td className="w-[30%] text-left">
                    {stock.title?.length > 30
                      ? stock.title?.substr(0, 30) + "..."
                      : stock.title}
                  </td>
                  <td className="w-[10%] text-center">{stock.price}</td>
                  <td className="flex w-[10%] text-center items-center justify-around">
                    <input
                      className="w-14 h-[2rem] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      placeholder=""
                      min={1}
                      // max={type === "return" ? stock.in_stock : ""}
                      name="quantity"
                      value={parseInt(stock.quantity) || ""}
                      onChange={(e) => {
                        handleChange(stock.ISBN, e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") e.preventDefault();
                      }}
                    />
                  </td>
                  <td className="w-[10%] text-center">
                    {(stock.price * stock?.quantity || 0).toFixed(2)}
                  </td>
                  <td className="w-[10%] text-center">
                    {(
                      (stock.price * stock?.quantity || 0) *
                      (1 - supplier?.percent / 100)
                    ).toFixed(2)}
                  </td>
                  <td className="w-[10%] text-center">
                    <button
                      className="text-red-500"
                      onClick={() => handleRemove(stock.ISBN)}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-1 text-center"
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageStocks;
