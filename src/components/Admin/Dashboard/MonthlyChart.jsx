import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useQuery } from "react-query";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import MonthlyModal from "./MonthlyModal";
import LoadingScreen from "../../Loading/LoadingScreen";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  height: "fit",
  maxHeight: "75vh",
  overflow: "scroll",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 8,
};

const months = {
  1: "ม.ค.",
  2: "ก.พ.",
  3: "มี.ค.",
  4: "เม.ย.",
  5: "พ.ค.",
  6: "มิ.ย.",
  7: "ก.ค.",
  8: "ส.ค.",
  9: "ก.ย.",
  10: "ต.ค.",
  11: "พ.ย.",
  12: "ธ.ค.",
};

export default function MonthlyChart() {
  const url = "/order/salesbycategory";
  const [rows, setRows] = useState(
    Array(12)
      .fill()
      .map((_, i) => [months[i + 1], 0, 0])
  );
  const [total, setTotal] = useState(0);

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, data } = useQuery(["all month sales"], fetchMyData);

  useEffect(() => {
    if (data) {
      let totalRevenue = 0;
      data.forEach((item) => {
        const monthIndex = item.month - 1;
        rows[monthIndex][1] = parseFloat(item.book_revenue);
        rows[monthIndex][2] = parseFloat(item.stationery_revenue);
        totalRevenue += parseFloat(item.total_revenue);
      });
      setTotal(totalRevenue);
    }
  }, [data]);

  const data1 = [["Month", "Books", "Others"], ...rows];

  const options = {
    chartArea: { width: "75%" },
    isStacked: true,
    hAxis: {
      title: "เดือน",
    },
    vAxis: {
      title: "ยอดขาย (บาท)",
    },
  };

  const [modalData, setModalData] = useState(null);

  const handleBarClick = (event) => {
    const { chartWrapper } = event;
    const chart = chartWrapper.getChart();

    const selection = chart.getSelection();
    if (selection.length > 0) {
      const selectedRow = selection[0].row + 1;
      const selectedMonth = data1[selectedRow][0];
      const selectedMonthIndex = Object.keys(months).find(
        (key) => months[key] === selectedMonth
      );
      const type = selection[0].column;

      setModalData({
        type,
        selectedMonthIndex,
        selectedMonth,
      });
    }

    setOpen(true);
  };

  const chartEvents = [
    {
      eventName: "select",
      callback: handleBarClick,
    },
  ];

  const [open, setOpen] = useState(false);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full">
      <div className="h-[57px] rounded-t-[4px] bg-black text-white px-4 py-2 flex justify-between items-center">
        <p className="font-bold">ยอดขายรายเดือน</p>
        <p className="font-bold">รายได้รวม: {total.toFixed(2)} บาท</p>
      </div>
      <div className="px-4">
        {rows.length > 0 && (
          <Chart
            chartType="ColumnChart"
            width="800px"
            height="500px"
            data={data1}
            options={options}
            chartEvents={chartEvents}
          />
        )}
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
            >
              <CloseIcon fontSize="medium" />
            </button>
            <div>
              <MonthlyModal modalData={modalData} />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
