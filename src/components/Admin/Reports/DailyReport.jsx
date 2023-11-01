import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import OrderDetailTable from "./OrderDetailTable";
import dayjs from "dayjs";
import LoadingScreen from "../../Loading/LoadingScreen";
import "../Stocks/THSarabunNew-normal";
import "../Stocks/THSarabunNew Bold-normal.js";
import OrderTable from "./OrderTable";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const DailyReport = () => {
  const currentDate = dayjs();
  const initialDateString = currentDate.format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(initialDateString);
  const [type, setType] = useState("item");
  const orderTableRef = useRef(null);

  const handleChange = (e) => {
    setType(e.target.value);
  };

  let url = `/order/date?date=` + dayjs(selectedDate).format("MM/DD/YYYY");
  useEffect(() => {
    url = `/order/date?date=` + dayjs(selectedDate).format("MM/DD/YYYY");
  }, [selectedDate]);

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, error, data } = useQuery(
    ["daily report", selectedDate],
    fetchMyData
  );

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
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem value={"item"}>ISBN</MenuItem>
                <MenuItem value={"order"}>Order id</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
        <div>
          <button
            className={`items-center text-white ${
              data.length == 0 ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"
            }  px-20 py-2.5 text-center ${type == "order" ? "opacity-0" : ""}`}
            onClick={() => orderTableRef.current.handlePrint()}
            disabled={data.length == 0}
          >
            <p className="text-lg flex gap-3 justify-center items-center">
              Print
            </p>
          </button>
        </div>
      </div>
      <div className="px-10 mt-10">
        {type == "item" ? (
          <OrderDetailTable
            data={data}
            ref={orderTableRef}
            isLoading={isLoading}
          />
        ) : (
          <OrderTable data={data} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default DailyReport;
