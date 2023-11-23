import React, { useContext, useEffect, useState } from "react";
import StockReportTable from "./StockReportTable";
import SupplierSelect from "../Books/SupplierSelect";
import { BookContext } from "../Books/Book";
import MonthSelect from "./MonthSelect";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingScreen from "../../Loading/LoadingScreen";

const StockReport = () => {
  const { supplier } = useContext(BookContext);
  const [month, setMonth] = useState("");
  const [rows, setRows] = useState([]);

  const handleMonthChange = (value) => {
    setMonth(value);
  };

  const url = `/stock/report?supplier_name=${supplier?.supplier_name}&month=${month}`;
  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, data } = useQuery(
    ["stock report", supplier, month],
    fetchMyData,
    {
      enabled: !!supplier && !!month,
    }
  );

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
          total_return_quantity: -parseInt(item.total_return_quantity),
          sold_quantity: -parseInt(item.sold_quantity),
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
      <div className="w-1/2 flex gap-10 mb-5">
        <div className="w-full">
          <SupplierSelect />
        </div>
        <div className="w-full ">
          <MonthSelect month={month} handleMonthChange={handleMonthChange} />
        </div>
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
