import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridPagination,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem,
} from "@mui/x-data-grid";
import * as XLSX from "xlsx";

function exportToExcel(data, columns, fileData) {
  let formattedData = data.map((row) => {
    let newRow = {};
    columns.forEach(({ field, headerName }) => {
      if (headerName == "จำนวนขายทั้งหมด")
        newRow["จำนวน"] = parseInt(row[field]);
      else if (headerName == "ยอดขายทั้งหมด")
        newRow["ยอดขาย"] = parseFloat(row[field]);
      else if (headerName == "ยอดขายหลังหักเปอร์เซนต์")
        newRow["ยอดหลังหัก%"] = parseFloat(row[field]);
      else newRow[headerName] = row[field];
    });
    return newRow;
  });

  let totalsRow = {};

  columns.forEach(({ field, headerName }) => {
    if (["total_quantity", "total_revenue", "net"].includes(field)) {
      let header_name = "";
      if (headerName == "จำนวนขายทั้งหมด") header_name = "จำนวน";
      else if (headerName == "ยอดขายทั้งหมด") header_name = "ยอดขาย";
      else if (headerName == "ยอดขายหลังหักเปอร์เซนต์")
        header_name = "ยอดหลังหัก%";
      else header_name = headerName;

      totalsRow[header_name] = data.reduce(
        (sum, row) => sum + (parseFloat(row[field]) || 0),
        0
      );
    } else {
      totalsRow[headerName] = "";
    }
  });
  // totalsRow["ยอดขาย"] = totalsRow["ยอดขาย"].toFixed(2);
  // totalsRow["ยอดหลังหัก%"] = totalsRow["ยอดหลังหัก%"].toFixed(2);

  formattedData.push(totalsRow);
  const fileName = `${fileData.supplier.supplier_name}-${fileData.month}-${fileData.year}`;
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, fileName + ".xlsx");
}

const GridToolbarExport = ({
  rows,
  columns,
  fileData,
  printOptions,
  ...other
}) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem
      onClick={() => exportToExcel(rows, columns, fileData)}
    />
    <GridPrintExportMenuItem options={printOptions} />
  </GridToolbarExportContainer>
);

function CustomToolbar({ rows, columns, fileData }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport rows={rows} columns={columns} fileData={fileData} />
    </GridToolbarContainer>
  );
}

const CustomFooter = ({ footerData }) => {
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
        <div style={{ flexBasis: "50px" }}></div>
        <div
          style={{ flexBasis: "150px", textAlign: "left", paddingLeft: "10px" }}
        >
          รวม
        </div>
        <div style={{ flexBasis: "330px" }}></div>
        <div style={{ flexBasis: "150px" }}></div>
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
  { field: "index", headerName: "ที่", width: 50 },
  { field: "id", headerName: "ISBN", width: 150 },
  { field: "title", headerName: "ชื่อ", width: 330 },
  { field: "supplier_name", headerName: "Supplier", width: 150 },
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
export default function MonthlyReportTableTotal({
  rows,
  footerData,
  fileData,
}) {
  return (
    <Box
      sx={{
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
              pageSize: 15,
            },
          },
        }}
        disableColumnFilter
        pageSizeOptions={[15, 50]}
        slots={{ toolbar: CustomToolbar, footer: CustomFooter }}
        slotProps={{
          toolbar: { rows, columns, fileData },
          footer: { footerData, rows, columns },
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
