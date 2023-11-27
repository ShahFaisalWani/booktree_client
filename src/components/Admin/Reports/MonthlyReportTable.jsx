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
import "./table.css";

import * as XLSX from "xlsx";

function exportToExcel(data, days, supplier) {
  let headerRow = [
    "ที่",
    "ISBN",
    "ชื่อ",
    ...Array.from({ length: days }, (_, i) => String(i + 1).padStart(2, "0")),
    "ราคาต่อหน่วย",
    "จำนวนขายทั้งหมด",
    "ยอดขายทั้งหมด",
  ];

  let totalQuantity = 0;
  let totalSold = 0;

  let formattedData = data.map((row, i) => {
    let rowArray = [];

    rowArray.push(i + 1);
    rowArray.push(row["id"]);
    rowArray.push(row["title"]);

    for (let i = 1; i <= days; i++) {
      let dayField = String(i).padStart(2, "0");
      rowArray.push(parseInt(row[dayField]) || 0);
    }

    rowArray.push(parseFloat(row["price"]));
    rowArray.push(parseInt(row["total_quantity"]));
    rowArray.push(parseFloat(row["total_revenue"]));

    totalQuantity += parseInt(row["total_quantity"]);
    totalSold += parseFloat(row["total_revenue"]);

    return rowArray;
  });

  let footerRow = [
    "",
    "",
    "",
    ...Array.from({ length: days }, () => ""),
    "รวม",
    totalQuantity,
    totalSold.toFixed(2),
  ];

  let footerRow2 = [
    "",
    "",
    "",
    ...Array.from({ length: days }, () => ""),
    "ยอดขายหลังหักเปอร์เซนต์",
    supplier.percent + "%",
    (totalSold * (1 - parseInt(supplier.percent) / 100)).toFixed(2),
  ];

  formattedData.unshift(headerRow);
  formattedData.push(footerRow);
  formattedData.push(footerRow2);

  const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, "supplier_report.xlsx");
}

const GridToolbarExport = ({
  rows,
  columns,
  days,
  supplier,
  printOptions,
  ...other
}) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem
      onClick={() => exportToExcel(rows, days, supplier)}
    />
    <GridPrintExportMenuItem options={printOptions} />
  </GridToolbarExportContainer>
);

function CustomToolbar({ rows, columns, days, supplier }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        rows={rows}
        columns={columns}
        days={days}
        supplier={supplier}
      />
    </GridToolbarContainer>
  );
}

export default function MonthlyReportTable({ days, rows, supplier }) {
  const columns = [
    { field: "id", headerName: "ISBN", width: 150 },
    { field: "title", headerName: "ชื่อ", width: 170 },
    { field: "price", headerName: "ราคาต่อหน่วย", width: 90 },
    ...Array(days)
      .fill()
      .map((_, i) => ({
        field: String(i + 1).padStart(2, "0"),
        headerName: String(i + 1).padStart(2, "0"),
        width: 35,
        minWidth: 35,
        maxWidth: 35,
      })),
    { field: "total_quantity", headerName: "จำนวนขายทั้งหมด", width: 50 },
    { field: "total_revenue", headerName: "ยอดขายทั้งหมด", width: 120 },
  ];

  return (
    <Box sx={{ width: "100%", margin: "auto" }}>
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
        disableColumnFilter
        pageSizeOptions={[20]}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: { rows, columns, days, supplier },
        }}
        className="table"
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
            body: {
              transform: "scale(0.75)",
              transformOrigin: "top left",
            },
            "@page": {
              size: "landscape",
              margin: 3,
            },
          },
        }}
      />
    </Box>
  );
}
