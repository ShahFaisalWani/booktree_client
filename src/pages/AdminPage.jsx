import React, { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/Loading/LoadingScreen";

const AdminDashboard = lazy(() =>
  import("../components/Admin/Dashboard/AdminDashboard")
);
const SellBooks = lazy(() => import("../components/Admin/Sell/SellBooks"));
const ReturnBooks = lazy(() =>
  import("../components/Admin/Stocks/ReturnBooks")
);
const BookProvider = lazy(() => import("../components/Admin/Books/Book"));
const CheckStock = lazy(() => import("../components/Admin/Stocks/CheckStock"));
const DailyReport = lazy(() =>
  import("../components/Admin/Reports/DailyReport")
);
const SupplierReport = lazy(() =>
  import("../components/Admin/Reports/SupplierReport")
);
const StockReport = lazy(() =>
  import("../components/Admin/Reports/StockReport")
);
const ManageMembers = lazy(() =>
  import("../components/Admin/Members/ManageMembers")
);
const ManageSuppliers = lazy(() =>
  import("../components/Admin/Suppliers/ManageSuppliers")
);
const ManageProducts = lazy(() => import("../components/Admin/ManageProducts"));
const RestockReport = lazy(() =>
  import("../components/Admin/Reports/RestockReport")
);

const AdminLinks = {
  default: "หน้าหลัก",
  sellbooks: "ขายสินค้า",
  restockbooks: "รับ/คืนสินค้า",
  manageproducts: "จัดการสินค้า",
  restockreport: "รายงานการจัดการสินค้า",
  checkstock: "เช็คสต็อก",
  stockreport: "รายงานสต็อก",
  dailyreport: "ยอดขายรายวัน",
  supplierreport: "ยอดขายรายเดือน",
  managesuppliers: "ตัวแทนจำหน่าย",
  managemembers: "สมาชิก",
};

const ComponentMapping = {
  default: AdminDashboard,
  sellbooks: SellBooks,
  restockbooks: ReturnBooks,
  manageproducts: ManageProducts,
  restockreport: RestockReport,
  checkstock: CheckStock,
  stockreport: StockReport,
  dailyreport: DailyReport,
  supplierreport: SupplierReport,
  managesuppliers: ManageSuppliers,
  managemembers: ManageMembers,
};

const AdminPage = () => {
  const { path } = useParams();

  const RenderedComponent = ComponentMapping[path] || ComponentMapping.default;
  const header = AdminLinks[path] || AdminLinks.default;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <BookProvider>
        <div className="py-2 text-xl mb-8 border-b-2 border-gray-300">
          {header}
        </div>
        <RenderedComponent />
      </BookProvider>
    </Suspense>
  );
};

export default AdminPage;
