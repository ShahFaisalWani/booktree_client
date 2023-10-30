import React, { useContext, useMemo, useState } from "react";
import SupplierSelect from "../Books/SupplierSelect";
import { useQuery } from "react-query";
import axios from "axios";
import MonthlyReportTable from "./MonthlyReportTable";

import { BookContext } from "../Books/Book";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import MonthlyReportTableTotal from "./MonthlyReportTableTotal";
import LoadingScreen from "../../Loading/LoadingScreen";
import MonthSelect from "./MonthSelect";

const SupplierReport = () => {
  const { supplier } = useContext(BookContext);
  const [month, setMonth] = useState("");

  const [type, setType] = useState("");
  const handleChange = (e) => {
    setType(e.target.value);
  };

  const handleMonthChange = (value) => {
    setMonth(value);
  };

  const today = new Date();
  const year = today.getFullYear();
  const days = new Date(year, month, 0).getDate();

  const url = `/order/monthlysalesby${
    type == "full" ? "dates" : "books"
  }?supplier_name=${supplier.supplier_name}&month=${month}`;

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, data } = useQuery(
    ["supplier report", supplier, month, type],
    fetchMyData,
    {
      enabled: !!supplier && !!month && !!type,
    }
  );
  let rowData = [];
  rowData = data ? (supplier.supplier_name == "All" ? data[6] : data[7]) : [];

  if (type == "full") {
    if (rowData?.length > 0)
      rowData.map((item) => {
        item["id"] = item.ISBN;
        Array(days)
          .fill()
          .map((_, i) => {
            const key = String(i + 1).padStart(2, "0");
            item[key] = item[key] ? item[key] : 0;
          });
      });
  } else if (type == "total") {
    if (rowData?.length > 0) {
      rowData.map((item) => {
        item["id"] = item.ISBN || "รวมทั้งหมด";
        item["percent"] = supplier.percent;
        item["net"] = (
          parseFloat(item.total_revenue) *
          (1 - parseFloat(supplier.percent) / 100)
        ).toFixed(2);
      });
    }
  }
  const footerData = useMemo(() => {
    if (type == "total" && rowData?.length > 0) {
      let totalSold = 0;
      let totalRevenue = 0;
      let totalNet = 0;
      rowData.map((item) => {
        totalSold += parseInt(item.total_quantity);
        totalRevenue += parseFloat(item.total_revenue);
        totalNet += parseFloat(item.net);
      });
      return {
        totalSold,
        totalRevenue: totalRevenue.toFixed(2),
        totalNet: totalNet.toFixed(2),
      };
    }
    return null;
  }, [type, rowData]);

  if (isLoading) return <LoadingScreen />;
  return (
    <div className=" flex flex-col items-center">
      <div className="w-1/2 flex gap-10 mb-5">
        <div className="w-full">
          <SupplierSelect />
        </div>
        <div className="w-full">
          <MonthSelect month={month} handleMonthChange={handleMonthChange} />
        </div>
        <div className="w-full">
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
                <MenuItem value={"full"}>Dates</MenuItem>
                <MenuItem value={"total"}>Total</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      <div className="mt-16">
        {type == "full" && rowData && (
          <MonthlyReportTable days={days} rows={rowData} />
        )}
        {type == "total" && rowData && (
          <MonthlyReportTableTotal rows={rowData} footerData={footerData} />
        )}
      </div>
    </div>
  );
};

export default SupplierReport;
