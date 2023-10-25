import React, { useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridPagination } from "@mui/x-data-grid";
import MyModal from "../../MyModal";
import { handleExport, printData } from "../Stocks/ManageStocks";

const CustomFooter = ({ footerData, type }) => {
  return (
    <div className="">
      <Box
        sx={{
          display: "flex",
          // width: "50%",
          paddingTop: "10px",
          textAlign: "right",
          borderBlock: "1px solid #eee",
          alignItems: "center",
          height: "50px",
        }}
      >
        <div
          style={{ flexBasis: "75px", textAlign: "left", paddingLeft: "10px" }}
        >
          รวม
        </div>
        <div style={{ flexBasis: "150px" }}></div>
        <div style={{ flexBasis: type == "add" ? "155px" : "200px" }}></div>
        <div
          style={{
            flexBasis: "100px",
            textAlign: "left",
          }}
        >
          {footerData.totalQuantity}
        </div>
        <div
          style={{
            flexBasis: "100px",
            textAlign: "left",
          }}
        >
          {footerData.totalPrice}
        </div>
        <div style={{ flexBasis: "100px", textAlign: "left" }}>
          {footerData.totalNet}
        </div>
      </Box>
      <Box>
        <GridPagination />
      </Box>
    </div>
  );
};

export default function RestockReportTable({
  rows,
  type,
  footerData,
  supplier,
}) {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState(null);

  const columns = [
    {
      field: "show_id",
      headerName: "ที่",
      width: 75,
      maxWidth: 75,
      minWidth: 75,
    },
    { field: "restock_id", headerName: "เลขที่อ้างอิง", width: 150 },
    { field: "date", headerName: "วันที่", width: 150 },
    {
      field: "quantity",
      headerName: "จำนวน",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "price",
      headerName: "มูลค่า",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "net",
      headerName: "ต้นทุน",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "ref_id",
      headerName: "Supplier Ref",
      width: 150,
      hide: true,
    },
    {
      field: "delivery_date",
      headerName: "วันที่ส่งสินค้า",
      width: 150,
      hide: true,
    },
  ];

  return (
    <div>
      <Box
        sx={{
          height: rows.length > 0 ? "fit" : 400,
          maxHeight: "70vh",
          width: "100%",
        }}
      >
        <DataGrid
          columnVisibilityModel={
            type == "add"
              ? {
                  ref_id: true,
                  delivery_date: true,
                }
              : {
                  ref_id: false,
                  delivery_date: false,
                }
          }
          onRowClick={(e) => {
            setRow(e.row);
            setOpen(true);
          }}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[10, 20, 30]}
          disableColumnFilter
          slots={{ toolbar: GridToolbar, footer: CustomFooter }}
          slotProps={{
            footer: { footerData, type },
          }}
          sx={{
            "@media print": {
              ".MuiDataGrid-main": {
                width: "fit-content",
                fontSize: "10px",
                height: "fit-content",
                overflow: "visible",
              },
              ".MuiDataGrid-toolbarContainer": {
                display: "none !important",
              },
              ".MuiDataGrid-footerContainer": {
                display: "none !important",
              },
              marginBottom: 10,
            },
          }}
        />
      </Box>
      {open && (
        <MyModal
          onClose={() => setOpen(false)}
          children={<DetailList row={row} type={type} supplier={supplier} />}
          width={"50%"}
        />
      )}
    </div>
  );
}

const DetailList = ({ row, type, supplier }) => {
  const exportData = {
    type: type,
    id: row.restock_id,
    refNum: row.ref_id,
    stockList: row.details,
    supplier: {
      supplier_name: supplier.supplier_name,
      percent: supplier.percent,
    },
  };

  const clickExport = () => {
    handleExport(exportData);
  };

  const clickPrint = () => {
    printData(exportData);
  };

  return (
    <div className="h-fit max-h-2/3 bg-white p-8 px-16">
      <table className="w-full">
        <thead className="">
          <tr className="bg-black">
            <th className="border-0 text-left p-[8px] text-white w-[7%]">
              ที่
            </th>
            <th className="border-0 text-left p-[8px] text-white w-[20%]">
              ISBN
            </th>
            <th className="border-0 text-left p-[8px] text-white w-[38%]">
              ชื่อสินค้า
            </th>
            <th className="border-0 text-centr p-[8px] text-white w-[10%]">
              ราคา
            </th>
            <th className="border-0 text-centr p-[8px] text-white w-[5%]">
              จำนวน
            </th>
            <th className="border-0 text-centr p-[8px] text-white w-[10%]">
              รวม
            </th>
          </tr>
        </thead>
      </table>
      <div className="max-h-[500px] overflow-y-scroll">
        <table className="w-full">
          <tbody>
            {row.details?.map((item, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-gray-200" : ""}>
                <td className="text-left p-[8px] w-[7%]">{i + 1}</td>
                <td className="text-left p-[8px] w-[20%]">{item.ISBN}</td>
                <td className="text-left p-[8px] w-[38%]">
                  {item?.title?.length > 30
                    ? item.title.substring(0, 30) + "..."
                    : item.title}
                </td>
                <td className="text-center p-[8px] w-[10%]">{item.price}</td>
                <td className="text-center p-[8px] w-[5%]">{item.quantity}</td>
                <td className="text-center p-[8px] w-[10%]">
                  {(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-10 pb-5 text-center w-full flex gap-20 justify-center">
        <button
          className="w-[100px] text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-md p-2 text-center"
          type="button"
          onClick={clickExport}
        >
          Excel
        </button>
        <button
          className="w-[100px] text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-md p-2 text-center"
          type="button"
          onClick={clickPrint}
        >
          Print
        </button>
      </div>
    </div>
  );
};
