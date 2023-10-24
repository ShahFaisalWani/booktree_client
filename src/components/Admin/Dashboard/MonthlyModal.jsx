import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import LoadingScreen from "../../Loading/LoadingScreen";

const MonthlyModal = ({ modalData }) => {
  const { selectedMonth, selectedMonthIndex, type } = modalData;
  let url = "";

  if (type == 1) url = "/order/suppliersalesbymonth/" + selectedMonthIndex;
  else url = "/stationery/suppliersalesbymonth/" + selectedMonthIndex;

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, data } = useQuery([url, selectedMonthIndex], fetchMyData);

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="max-h-[60vh] overflow-scroll">
      <p className="mb-4 text-lg">
        ยอดขายตามตัวแทนจำหน่ายในเดือน <b>{selectedMonth}</b>
      </p>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-[1px] border-black text-left p-[8px]">No.</th>
            <th className="border-[1px] border-black text-left p-[8px]">
              ตัวแทนจำหน่าย
            </th>
            <th className="border-[1px] border-black text-left p-[8px]">
              ยอดขาย
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, i) => (
            <tr key={i}>
              <td className="border-[1px] border-black text-left p-[8px]">
                {i + 1}
              </td>
              <td className="border-[1px] border-black text-left p-[8px]">
                {item.supplier_name}
              </td>
              <td className="border-[1px] border-black text-left p-[8px]">
                {item.total_revenue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyModal;
