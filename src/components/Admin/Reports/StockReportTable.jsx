import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem,
} from "@mui/x-data-grid";

import * as XLSX from "xlsx";

function exportToExcel(data, columns, month, supplier) {
  let totalAdd = 0;
  let totalReturn = 0;
  let TotalSold = 0;
  let TotalInStock = 0;
  let TotalRevenue = 0;

  let formattedData = data.map((row) => {
    totalAdd += row.total_add_quantity ? row.total_add_quantity : 0;
    totalReturn += row.total_return_quantity ? row.total_return_quantity : 0;
    TotalSold += row.sold_quantity ? row.sold_quantity : 0;
    TotalInStock += row.in_stock ? row.in_stock : 0;
    TotalRevenue += row.in_stock_revenue ? parseFloat(row.in_stock_revenue) : 0;

    let newRow = {};
    columns.forEach(({ field, headerName }) => {
      newRow[headerName] = row[field];
    });
    return newRow;
  });

  let footerRow = [];
  if (supplier.supplier_name == "All") {
    footerRow = [
      "รวม",
      "",
      "",
      "",
      "",
      "",
      totalAdd,
      totalReturn,
      TotalSold,
      TotalInStock,
      TotalRevenue.toFixed(2),
    ];
  } else {
    footerRow = [
      "รวม",
      "",
      "",
      "",
      totalAdd,
      totalReturn,
      TotalSold,
      TotalInStock,
      TotalRevenue.toFixed(2),
    ];
  }

  let newRow = {};
  columns.forEach(({ field, headerName }, i) => {
    newRow[headerName] = footerRow[i];
  });

  formattedData.push(newRow);

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "เดือน " + month);
  XLSX.writeFile(
    workbook,
    "report-" + supplier.supplier_name + "-" + month + "" + ".xlsx"
  );
}

const GridToolbarExport = ({
  rows,
  columns,
  month,
  supplier,
  printOptions,
  ...other
}) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem
      onClick={() => exportToExcel(rows, columns, month, supplier)}
    />
    <GridPrintExportMenuItem options={printOptions} />
  </GridToolbarExportContainer>
);

function CustomToolbar({ rows, columns, month, supplier }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        rows={rows}
        columns={columns}
        month={month}
        supplier={supplier}
      />
    </GridToolbarContainer>
  );
}

export default function StockReportTable({ rows, month, supplier }) {
  const columns = [];

  const firstPart = [
    { field: "id", headerName: "ที่", width: 75, maxWidth: 75, minWidth: 75 },
    { field: "ISBN", headerName: "ISBN", width: 150 },
    { field: "title", headerName: "ชื่อ", width: 230 },
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
    { field: "price", headerName: "ราคา", width: 80 },
    {
      field: "total_add_quantity",
      headerName: "รับ",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    // { field: "total_add_revenue", headerName: "มูลค่าเพิ่มสต็อก", width: 100 },
    {
      field: "total_return_quantity",
      headerName: "คืน",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    // { field: "total_return_revenue", headerName: "มูลค่าคืนสต็อก", width: 100 },
    {
      field: "sold_quantity",
      headerName: "ขาย",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    // { field: "sold_revenue", headerName: "มูลค่าขาย", width: 100 },
    {
      field: "in_stock",
      headerName: "คงเหลือ",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "in_stock_revenue",
      headerName: "มูลค่า",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
  ];
  columns.push(...firstPart);
  if (supplier.supplier_name == "All") columns.push(...middlePart);
  columns.push(...lastPart);

  return (
    <Box
      sx={{
        height: rows.length > 0 ? "fit" : 400,
        maxHeight: "70vh",
        width: "100%",
        margin: "auto",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
        disableColumnFilter
        slots={{ toolbar: CustomToolbar }}
        slotProps={{ toolbar: { rows, columns, month, supplier } }}
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
            marginBottom: 100,
          },
        }}
      />
    </Box>
  );
}
