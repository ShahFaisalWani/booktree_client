import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "./table.css";

export default function MonthlyReportTable({ days, rows }) {
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
        slots={{ toolbar: GridToolbar }}
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
