import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function StockReportTable({ rows }) {
  const columns = [
    { field: "id", headerName: "ที่", width: 75, maxWidth: 75, minWidth: 75 },
    { field: "ISBN", headerName: "ISBN", width: 150 },
    { field: "title", headerName: "ชื่อ", width: 230 },
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
        slots={{ toolbar: GridToolbar }}
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
