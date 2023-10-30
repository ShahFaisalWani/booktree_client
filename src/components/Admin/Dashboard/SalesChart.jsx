import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { useQuery } from "react-query";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "ยอดขายรายวัน",
    },
  },
};

export default function SalesChart() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const orderObj = function (order) {
    const newDate = new Date(order.date);
    const hour = newDate.getHours();
    const minute = newDate.getMinutes();
    let time =
      hour.toString().padStart(2, "0") +
      ":" +
      minute.toString().padStart(2, "0");

    return {
      order_id: order.order_id || "",
      date: time || "",
      total: parseFloat(order.total) || "",
      payment: order.payment || "",
    };
  };

  const url = "/order/date?date=" + selectedDate.toLocaleString().split(",")[0];

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, error, data } = useQuery(
    ["daily report", selectedDate],
    fetchMyData
  );

  const [labels, setLabels] = useState([]);
  const [totals, setTotals] = useState([]);
  useEffect(() => {
    if (data) {
      const tempTime = [];
      const tempTotal = [];
      Object.keys(data).map((item) => {
        const time = orderObj(data[item].order).date;
        const total = orderObj(data[item].order).total;
        tempTime.push(time);
        tempTotal.push(total);
      });
      setLabels(tempTime);
      setTotals(tempTotal);
    } else {
      setLabels(["0"]);
      setTotals([0]);
    }
  }, [data]);

  const data1 = {
    labels,
    datasets: [
      {
        label: "ราคา",
        data: totals,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="w-full h-[600px]">
      <div className="h-[57px] rounded-t-[4px] bg-black text-white px-4 py-2 flex justify-between items-center">
        <div className="font-bold flex justify-between items-center gap-5">
          <span className="text-black">
            <input
              name="deliverDate"
              type="date"
              className="border border-gray-500 placeholder-gray-400 p-2 py-1"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </span>
        </div>
        <p className="font-bold">
          รายได้รวม: {totals.reduce((sum, total) => sum + parseFloat(total), 0)}{" "}
          บาท
        </p>
      </div>
      <div>
        {totals.length > 0 && (
          <Line options={options} data={data1} width={500} height={500} />
        )}
      </div>
    </div>
  );
}
