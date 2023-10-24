import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import OrderTable from "./OrderTable";
import ReactDatePicker from "react-datepicker";

const DailyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  let url = "/order/date?date=" + selectedDate.toLocaleString().split(",")[0];
  useEffect(() => {
    url = "/order/date?date=" + selectedDate.toLocaleString().split(",")[0];
  }, [selectedDate]);

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, error, data } = useQuery(
    ["daily report", selectedDate],
    fetchMyData
  );

  const rowsCash = [];
  const rowsTransfer = [];
  data &&
    Object.keys(data).map((item) => {
      if (data[item].order.payment === "cash") {
        for (let i = 0; i < Object.keys(data[item].order_details).length; i++) {
          updateOrPushOrder(rowsCash, orderObj(data[item].order_details[i]));
        }
      } else if (data[item].order.payment === "transfer") {
        for (let i = 0; i < Object.keys(data[item].order_details).length; i++) {
          updateOrPushOrder(
            rowsTransfer,
            orderObj(data[item].order_details[i])
          );
        }
      }
    });

  return (
    <div>
      <div className="flex items-center gap-5 mb-10">
        <p>วันที่</p>
        <ReactDatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </div>
      <div className="flex">
        <div className="w-1/2 border-r-4 h-screen px-10 text-center">
          <h1 className="mb-8">เงินสด</h1>
          <OrderTable rows={rowsCash} />
        </div>
        <div className="w-1/2 px-10 h-screen text-center">
          <h1 className="mb-8">เงินโอน</h1>
          <OrderTable rows={rowsTransfer} />
        </div>
      </div>
    </div>
  );
};

export default DailyReport;
