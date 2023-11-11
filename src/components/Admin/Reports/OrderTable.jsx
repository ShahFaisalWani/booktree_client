import { useEffect, useState } from "react";
import MyModal from "../../MyModal";
import LoadingScreen from "../../Loading/LoadingScreen";

const OrderTable = ({ data, isLoading }) => {
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
                  setCurrentRow(item.order_details);
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
                    {currentRow?.map((row, i) => (
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
};

export default OrderTable;
