import {
  useEffect,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import MyModal from "../../MyModal";
import LoadingScreen from "../../Loading/LoadingScreen";

function dataToHTMLTable(data) {
  let html =
    '<table style="width: 100%; border-collapse: collapse; border: none; font-size: 13px;">';

  data.forEach((row, i) => {
    html += "<tr>";
    let colspanEndIndex = null;

    ["A", "B", "C", "D", "E", "F", "G"].forEach((col, index, array) => {
      if (row.colspanStart === col && row.colspan) {
        colspanEndIndex = index + parseInt(row.colspan);
        html += `<td colspan="${row.colspan}" style="border: none;">${
          row[col] || ""
        }</td>`;
      } else if (
        (colspanEndIndex === null || index >= colspanEndIndex) &&
        i < 4
      ) {
        html += `<td style="border: none;${
          ["A", "B", "C", "D", "E", "F", "G"].includes(col)
            ? " text-align: left;"
            : ""
        } padding: 5px;">${row[col] || ""}</td>`;
      } else if (
        (colspanEndIndex === null || index >= colspanEndIndex) &&
        col == "C"
      ) {
        html += `<td style="border: 1px solid black;${
          ["C", "D", "E", "F", "G"].includes(col) ? " text-align: left;" : ""
        } padding: 5px;">${row[col] || ""}</td>`;
      } else if (colspanEndIndex === null || index >= colspanEndIndex) {
        html += `<td style="border: 1px solid black;${
          ["C", "D", "E", "F", "G"].includes(col) ? " text-align: center;" : ""
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
      F: "",
      G: "ใบเสร็จรับเงิน",
    },
    {
      A: "19 ม.2 ต.บางนายสี อ.ตะกั่วป่า จ.พังงา 82110 โทร. 095-0259234",
      colspanStart: "A",
      colspan: "3",
      D: "",
      E: "",
      F: "",
    },
    {
      A: "ลูกค้า",
      colspanStart: "A",
      colspan: "2",
      C: "",
      D: "",
      E: "",
      F: "",
    },
    {
      A: "",
      B: "",
      colspanStart: "",
      colspan: "2",
      E: "",
      F: "วันที่เอกสาร",
      G: modalData.order.date.split(",")[0],
    },
  ];

  let quantitySum = 0;
  let totalSum = 0;
  let totalDiscount = 0;
  modalData?.order_details.map((book) => {
    quantitySum += parseFloat(book.quantity);
    totalSum += parseFloat(book.total);
    totalDiscount += parseFloat(book.discount);
  });

  const data = [
    ...extraRows,
    {
      A: "ลำดับ",
      B: "บาร์โค้ด",
      C: "ชื่อหนังสือ",
      D: "จำนวน",
      E: "ราคา",
      F: "ส่วนลด",
      G: "รวมทั้งหมด",
    },
    ...modalData?.order_details.map((book, i) => ({
      A: i + 1,
      B: book.ISBN,
      C: book.title,
      D: book.quantity,
      E: book.price,
      F: book.discount,
      G: book.total.toFixed(2),
    })),
    {
      A: "",
      B: "",
      C: "",
      D: quantitySum,
      E: "ชิ้น",
      F: totalDiscount.toFixed(2),
      G: totalSum.toFixed(2),
    },
    {
      A: "",
      B: "",
      C: "",
      D: "",
      E: "รวมทั้งหมด",
      F: "",
      G: totalSum.toFixed(2),
    },
  ];
  return data;
};

const OrderTable = forwardRef((props, ref) => {
  const { data, isLoading } = props;
  const [currentRow, setCurrentRow] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!data) return;
    const newData = Object.keys(data).map((item, i) => {
      const formattedDate = new Date(data[item].order.date).toLocaleString(
        "en-GB"
      );
      return {
        order: { ...data[item].order, date: formattedDate },
        order_details: [...data[item].order_details],
      };
    });
    setRows(newData);
  }, []);

  const printList = () => {
    const data = createExcelData(currentRow);

    const html = dataToHTMLTable(data);
    const iframe = document.createElement("iframe");

    document.body.appendChild(iframe);

    iframe.style.display = "none";
    iframe.contentDocument.open();
    iframe.contentDocument.write(
      `<html><head><title>Booktree</title></head><body>`
    );
    iframe.contentDocument.write(html);
    iframe.contentDocument.write("</body></html>");
    iframe.contentDocument.close();

    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <table className="w-full">
        <thead className="">
          <tr className="bg-black">
            <th className="border-0 text-center p-[8px] text-white w-[5%]">
              ที่
            </th>
            <th className="border-0 text-center p-[8px] text-white w-[15%]">
              รหัสออเดอร์
            </th>
            <th className="border-0 text-center p-[8px] text-white w-[20%]">
              เบอร์โทร
            </th>
            <th className="border-0 text-center p-[8px] text-white w-[20%]">
              วันที่
            </th>
            <th className="border-0 text-center p-[8px] text-white w-[20%]">
              ยอดรวม
            </th>
            <th className="border-0 text-center p-[8px] text-white w-[20%]">
              ชำระโดย
            </th>
          </tr>
        </thead>
      </table>
      <div className="max-h-[500px] overflow-y-scroll">
        <table className="w-full">
          <tbody>
            {rows.map((item, i) => (
              <tr
                key={i}
                className={`h-14 hover:bg-gray-300 transition-all ${
                  i % 2 === 1 ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setCurrentRow(item);
                }}
              >
                <td className="text-center p-[8px] w-[5%]">{i + 1}</td>
                <td className="text-center p-[8px] w-[15%]">
                  {item.order.order_id}
                </td>
                <td className="text-center p-[8px] w-[20%]">
                  {item.order.customer_phone_number}
                </td>
                <td className="text-center p-[8px] w-[20%]">
                  {item.order.date}
                </td>
                <td className="text-center p-[8px] w-[20%]">
                  {item.order.total}
                </td>
                <td className="text-center p-[8px] w-[20%]">
                  {item.order.payment == "cash" ? "เงินสด" : "โอน"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {currentRow && (
        <MyModal
          width={"60vw"}
          onClose={() => setCurrentRow(false)}
          children={
            <div className="py-16 px-10">
              <div className="mb-5">
                <button
                  className={`items-center text-white bg-blue-700 hover:bg-blue-800  px-20 py-2.5 text-center `}
                  onClick={printList}
                >
                  <p className="text-lg flex gap-3 justify-center items-center">
                    Print
                  </p>
                </button>
              </div>
              <table className="w-full">
                <thead className="">
                  <tr className="bg-black">
                    <th className="border-0 text-left p-[8px] text-white w-[7%]">
                      ที่
                    </th>
                    <th className="border-0 text-left p-[8px] text-white w-[20%]">
                      ISBN
                    </th>
                    <th className="border-0 text-left p-[8px] text-white w-[38%]">
                      ชื่อ
                    </th>
                    <th className="border-0 text-centr p-[8px] text-white w-[10%]">
                      ราคา
                    </th>
                    <th className="border-0 text-centr p-[8px] text-white w-[5%]">
                      จำนวน
                    </th>
                    <th className="border-0 text-centr p-[8px] text-white w-[10%]">
                      ส่วนลด
                    </th>
                    <th className="border-0 text-centr p-[8px] text-white w-[10%]">
                      รวม
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="max-h-[500px] overflow-y-scroll">
                <table className="w-full">
                  <tbody>
                    {currentRow?.order_details?.map((row, i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-gray-200" : ""}>
                        <td className="text-left p-[8px] w-[7%]">{i + 1}</td>
                        <td className="text-left p-[8px] w-[20%]">
                          {row.ISBN}
                        </td>
                        <td className="text-left p-[8px] w-[38%]">
                          {row.title}
                        </td>
                        <td className="text-center p-[8px] w-[10%]">
                          {row.price}
                        </td>
                        <td className="text-center p-[8px] w-[5%]">
                          {row.quantity}
                        </td>
                        <td className="text-center p-[8px] w-[10%]">
                          {row.discount}
                        </td>
                        <td className="text-center p-[8px] w-[10%]">
                          {row.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
        />
      )}
    </>
  );
});

export default OrderTable;
