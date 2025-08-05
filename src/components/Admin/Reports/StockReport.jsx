import React, { useEffect, useState } from "react";
import StockReportTable from "./StockReportTable";
import SupplierSelect from "../Books/SupplierSelect";
import MonthSelect from "./MonthSelect";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingScreen from "../../Loading/LoadingScreen";
import YearSelect from "./YearSelect";
import toast from "react-hot-toast";
import { useBookContext } from "../../../contexts/admin/BookContext";

const StockReport = () => {
  const { supplier } = useBookContext();
  const [month, setMonth] = useState("");
  const [rows, setRows] = useState([]);
  const [year, setYear] = useState("");

  const handleMonthChange = (value) => {
    setMonth(value);
  };

  const handleYearChange = (value) => {
    setYear(value);
  };

  const url = `/stock/report?supplier_name=${supplier?.supplier_name}&month=${month}&year=${year}`;
  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, data, refetch } = useQuery(
    ["stock report", supplier, month, year],
    fetchMyData,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const handleSearch = () => {
    if (!supplier || !month || !year) {
      toast.error("เลือกให้ครบ");
      return;
    }
    refetch();
  };

  useEffect(() => {
    if (data) {
      const newRows = [];
      data.map((item, i) => {
        newRows.push({
          id: i + 1,
          ISBN: item.ISBN,
          title: item.title,
          price: item.price,
          overflow: parseInt(item.overflow),
          total_add_quantity: parseInt(item.total_add_quantity),
          total_return_quantity: parseInt(item.total_return_quantity),
          sold_quantity: -parseInt(item.sold_quantity),
          total_restock_quantity: parseInt(item.total_restock_quantity),
          in_stock: item.in_stock,
          in_stock_revenue: parseFloat(item.in_stock_revenue),
          supplier_name: item.supplier_name,
          percent: item.percent,
        });
      });
      setRows(newRows);
    }
  }, [data]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full justify-center items-center gap-10 mb-5">
        <SupplierSelect />
        <MonthSelect month={month} handleMonthChange={handleMonthChange} />
        <YearSelect year={year} handleYearChange={handleYearChange} />
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xs px-4 py-2 text-center"
          onClick={handleSearch}
        >
          ค้นหา
        </button>
      </div>
      <div className="mt-16">
        {rows && (
          <StockReportTable rows={rows} month={month} supplier={supplier} />
        )}
      </div>
    </div>
  );
};

export default StockReport;
