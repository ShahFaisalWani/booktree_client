import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem,
  GridPagination,
} from "@mui/x-data-grid";
import MyModal from "../../MyModal";
import { handleExport, printData } from "../Stocks/ManageStocks";

import * as XLSX from "xlsx";

function exportToExcel(data, columns, footerData) {
  let formattedData = data.map((row) => {
    let newRow = {};
    columns.forEach(({ field, headerName }) => {
      newRow[headerName] = row[field];
    });
    return newRow;
  });
  let footerRow = [
    "รวม",
    "",
    "",
    footerData.totalQuantity,
    footerData.totalPrice,
    footerData.totalNet,
  ];
  let newRow = {};
  columns.forEach(({ field, headerName }, i) => {
    newRow[headerName] = footerRow[i];
  });

  formattedData.push(newRow);

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, "report.xlsx");
}

const GridToolbarExport = ({
  rows,
  columns,
  footerData,
  printOptions,
  ...other
}) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem
      onClick={() => exportToExcel(rows, columns, footerData)}
    />
    <GridPrintExportMenuItem options={printOptions} />
  </GridToolbarExportContainer>
);

function CustomToolbar({ rows, columns, footerData }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        rows={rows}
        columns={columns}
        footerData={footerData}
      />
    </GridToolbarContainer>
  );
}

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
        <div style={{ flexBasis: "150px" }}></div>
        <div style={{ flexBasis: "200px" }}></div>
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

  const columns = [];
  const firstPart = [
    {
      field: "show_id",
      headerName: "ที่",
      width: 75,
      maxWidth: 75,
      minWidth: 75,
    },
    { field: "restock_id", headerName: "เลขที่อ้างอิง", width: 150 },
    { field: "date", headerName: "วันที่", width: 150 },
  ];
  const middlePart = [
    {
      field: "supplier_name",
      headerName: "ตัวแทนจำหน่าย",
      width: 120,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "percent",
      headerName: "%",
      width: 70,
      align: "left",
      headerAlign: "left",
    },
  ];
  const lastPart = [
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
  columns.push(...firstPart);
  if (supplier.supplier_name == "All") columns.push(...middlePart);
  columns.push(...lastPart);

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
            type == "order"
              ? {
                  ref_id: false,
                  delivery_date: false,
                }
              : type == "add"
              ? {
                  ref_id: true,
                  delivery_date: true,
                }
              : {
                  ref_id: true,
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
          slots={{ toolbar: CustomToolbar, footer: CustomFooter }}
          slotProps={{
            toolbar: { rows, columns, footerData },
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

const DetailList = ({ row, type }) => {
  const exportData = {
    type: type,
    id: row.restock_id,
    refNum: row.ref_id,
    stockList: row.details,
    deliveryDate: row.delivery_date,
    supplier: {
      supplier_name: row.supplier_name,
      percent: row.percent,
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
            <th className="border-0 text-left p-2 text-white w-[7%]">ที่</th>
            <th className="border-0 text-left p-2 text-white w-[20%]">ISBN</th>
            <th className="border-0 text-left p-2 text-white w-[30%]">
              ชื่อสินค้า
            </th>
            <th className="border-0 text-center p-2 text-white w-[10%]">
              ราคา
            </th>
            {row.details[0].type && (
              <th className="border-0 text-center p-2 text-white w-[8%]">
                ปรับ
              </th>
            )}
            <th className="border-0 text-center p-2 text-white w-[5%]">
              จำนวน
            </th>
            <th className="border-0 text-center p-2 text-white w-[10%]">รวม</th>
          </tr>
        </thead>
      </table>
      <div className="max-h-[500px] overflow-y-scroll">
        <table className="w-full">
          <tbody>
            {row.details?.map((item, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-gray-200" : ""}>
                <td className="text-left p-2 w-[7%]">{i + 1}</td>
                <td className="text-left p-2 w-[20%]">{item.ISBN}</td>
                <td className="text-left p-2 w-[30%]">
                  {item?.title?.length > 25
                    ? item.title.substring(0, 20) + "..."
                    : item.title}
                </td>
                <td className="text-center p-2 w-[10%]">{item.price}</td>
                {item.type && (
                  <td className="p-2 w-[8%]">
                    {item.type == "add" ? "รับ" : "คืน"}
                  </td>
                )}
                <td className="text-center p-2 w-[5%]">{item.quantity}</td>
                <td className="text-center p-2 w-[10%]">
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
