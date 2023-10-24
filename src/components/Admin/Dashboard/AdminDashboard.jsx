import React from "react";
import SalesChart from "./SalesChart";
import MonthlyChart from "./MonthlyChart";
import OrderPanel from "./OrderPanel";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center mb-10">
        <div>
          <OrderPanel />
        </div>
      </div>
      <div className="flex justify-center gap-5 border-y-2 py-10">
        <div className="border-r-2 pr-10">
          <SalesChart />
        </div>
        <div>
          <MonthlyChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
