import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridPagination } from "@mui/x-data-grid";

const CustomFooter = ({ footerData, type }) => {
  return (
    <div className="">
      <Box
        sx={{
          display: "flex",
          paddingTop: "10px",
          textAlign: "right",
          borderBlock: "1px solid #eee",
          alignItems: "center",
          height: "50px",
        }}
      >
        <div
          style={{ flexBasis: "150px", textAlign: "left", paddingLeft: "10px" }}
        >
          รวม
        </div>
        <div style={{ flexBasis: "330px" }}></div>
        <div style={{ flexBasis: "70px", textAlign: "center" }}></div>
        <div style={{ flexBasis: "130px", textAlign: "center" }}>
          {footerData?.totalSold}
        </div>
        <div style={{ flexBasis: "150px", textAlign: "center" }}>
          {footerData?.totalRevenue}
        </div>
        <div style={{ flexBasis: "170px", textAlign: "center" }}>
          {footerData?.totalNet}
        </div>
      </Box>
      <Box>
        <GridPagination />
      </Box>
    </div>
  );
};

const columns = [
  { field: "id", headerName: "ISBN", width: 150 },
  { field: "title", headerName: "ชื่อ", width: 330 },
  { field: "percent", headerName: "%", width: 70 },
  {
    field: "total_quantity",
    headerName: "จำนวนขายทั้งหมด",
    width: 130,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "total_revenue",
    headerName: "ยอดขายทั้งหมด",
    width: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "net",
    headerName: "ยอดขายหลังหักเปอร์เซนต์",
    width: 170,
    align: "center",
    headerAlign: "center",
  },
];
export default function MonthlyReportTableTotal({ rows, footerData }) {
  return (
    <Box
      sx={{
        height: rows.length > 4 ? 400 : "fit",
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
              pageSize: 5,
            },
          },
        }}
        disableColumnFilter
        pageSizeOptions={[5]}
        slots={{ toolbar: GridToolbar, footer: CustomFooter }}
        slotProps={{
          footer: { footerData },
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
            marginBottom: 100,
          },
        }}
      />
    </Box>
  );
}
