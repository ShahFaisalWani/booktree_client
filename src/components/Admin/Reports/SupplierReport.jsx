import React, { useContext, useEffect, useMemo, useState } from "react";
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
import YearSelect from "./YearSelect";
import toast from "react-hot-toast";

const SupplierReport = () => {
  const { supplier } = useContext(BookContext);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [tableData, setTableData] = useState([]);

  const [type, setType] = useState("");
  const handleChange = (e) => {
    setType(e.target.value);
  };

  const handleMonthChange = (value) => {
    setMonth(value);
  };
  const handleYearChange = (value) => {
    setYear(value);
  };

  const days = new Date(year, month, 0).getDate();

  const url = `/order/monthlysalesby${
    type == "full" ? "dates" : "books"
  }?supplier_name=${supplier.supplier_name}&month=${month}&year=${year}`;

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, data, refetch } = useQuery(
    ["supplier report", supplier, month, year, type],
    fetchMyData,
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (newData) => {
        let rowData = newData
          ? supplier.supplier_name == "All"
            ? newData[6]
            : newData[7]
          : [];
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
            rowData.map((item, i) => {
              item["index"] = i + 1;
              item["id"] = item.ISBN || "รวมทั้งหมด";
              item["percent"] = item.percent;
              item["supplier_name"] = item.supplier_name;
              item["net"] = (
                parseFloat(item.total_revenue) *
                (1 - parseFloat(item.percent) / 100)
              ).toFixed(2);
            });
          }
        }
        setTableData(rowData);
      },
    }
  );

  useEffect(() => {
    setTableData([]);
  }, [type]);

  const footerData = useMemo(() => {
    if (type == "total" && tableData?.length > 0) {
      let totalSold = 0;
      let totalRevenue = 0;
      let totalNet = 0;
      tableData.map((item) => {
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
  }, [type, tableData]);

  const handleSearch = () => {
    if (!supplier || !month || !year || !type) {
      toast.error("เลือกให้ครบ");
      return;
    }
    refetch();
  };

  if (isLoading) return <LoadingScreen />;
  return (
    <div className=" flex flex-col items-center">
      <div className="w-1/2 flex gap-10 mb-5 items-center">
        <div className="w-full">
          <SupplierSelect />
        </div>
        <div className="w-full flex gap-4">
          <MonthSelect month={month} handleMonthChange={handleMonthChange} />
          <YearSelect year={year} handleYearChange={handleYearChange} />
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
        <div>
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xs px-4 py-2 text-center"
            onClick={handleSearch}
          >
            ค้นหา
          </button>
        </div>
      </div>
      <div className="mt-16">
        {type == "full" && tableData.length > 0 && (
          <MonthlyReportTable
            days={days}
            rows={tableData}
            supplier={supplier}
          />
        )}
        {type == "total" && tableData.length > 0 && (
          <MonthlyReportTableTotal
            rows={tableData}
            footerData={footerData}
            fileData={{ supplier, month, year }}
          />
        )}
      </div>
    </div>
  );
};

export default SupplierReport;
