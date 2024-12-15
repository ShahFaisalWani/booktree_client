import React, { useEffect, useState } from "react";
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
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import * as XLSX from "xlsx";

function exportToExcel(
  data,
  columns,
  month,
  supplier,
  total_overflow,
  total_add,
  total_return,
  total_sold,
  total_restock,
  total_in_stock,
  total_revenue
) {
  let formattedData = data.map((row) => {
    let newRow = {};
    columns.forEach(({ field, headerName }) => {
      if (headerName == "คงเหลือ") newRow[headerName] = parseInt(row[field]);
      else if (headerName == "มูลค่า")
        newRow[headerName] = parseFloat(row[field]);
      else if (headerName == "ขาย") newRow[headerName] = parseInt(row[field]);
      else if (headerName == "รับ") newRow[headerName] = parseInt(row[field]);
      else if (headerName == "คืน") newRow[headerName] = parseInt(row[field]);
      else if (headerName == "ยกมา") newRow[headerName] = parseInt(row[field]);
      else newRow[headerName] = row[field];
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
      total_overflow,
      total_add,
      total_return,
      total_sold,
      total_restock,
      total_in_stock,
      total_revenue.toFixed(2),
    ];
  } else {
    footerRow = [
      "รวม",
      "",
      "",
      "",
      total_overflow,
      total_add,
      total_return,
      total_sold,
      total_restock,
      total_in_stock,
      total_revenue.toFixed(2),
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
  total_overflow,
  total_add,
  total_return,
  total_sold,
  total_restock,
  total_in_stock,
  total_revenue,
  ...other
}) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem
      onClick={() =>
        exportToExcel(
          rows,
          columns,
          month,
          supplier,
          total_overflow,
          total_add,
          total_return,
          total_sold,
          total_restock,
          total_in_stock,
          total_revenue
        )
      }
    />
    <GridPrintExportMenuItem options={printOptions} />
  </GridToolbarExportContainer>
);

function CustomToolbar({
  rows,
  columns,
  month,
  supplier,
  total_overflow,
  total_add,
  total_return,
  total_sold,
  total_restock,
  total_in_stock,
  total_revenue,
}) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <div className="ml-auto">
        <GridToolbarQuickFilter />
      </div>
      <GridToolbarExport
        rows={rows}
        columns={columns}
        month={month}
        supplier={supplier}
        total_overflow={total_overflow}
        total_add={total_add}
        total_return={total_return}
        total_sold={total_sold}
        total_restock={total_restock}
        total_in_stock={total_in_stock}
        total_revenue={total_revenue}
      />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          borderBlock: "1px solid #eee",
          alignItems: "center",
          height: "50px",
        }}
      >
        <div style={{ flexBasis: "150px" }}>รวม</div>
        <div style={{ flexBasis: "150px" }}></div>
        <div
          style={{
            flexBasis: supplier.supplier_name == "All" ? "420px" : "240px",
          }}
        ></div>

        <div
          style={{
            flexBasis: "100px",
            textAlign: "center",
          }}
        >
          {total_overflow}
        </div>
        <div
          style={{
            flexBasis: "100px",
            textAlign: "center",
          }}
        >
          {total_add}
        </div>
        <div
          style={{
            flexBasis: "100px",
            textAlign: "center",
          }}
        >
          {total_return}
        </div>
        <div
          style={{
            flexBasis: "100px",
            textAlign: "center",
          }}
        >
          {total_sold}
        </div>
        <div
          style={{
            flexBasis: "100px",
            textAlign: "center",
          }}
        >
          {total_restock}
        </div>
        <div
          style={{
            flexBasis: "100px",
            textAlign: "center",
          }}
        >
          {total_in_stock}
        </div>
        <div
          style={{
            flexBasis: "150px",
            textAlign: "center",
          }}
        >
          {total_revenue.toFixed(2)}
        </div>
      </Box>
    </GridToolbarContainer>
  );
}

export default function StockReportTable({ rows, month, supplier }) {
  const [total_overflow, setTotalOverflow] = useState(0);
  const [total_add, setTotalAdd] = useState(0);
  const [total_return, setTotalReturn] = useState(0);
  const [total_sold, setTotalSold] = useState(0);
  const [total_restock, setTotalRestock] = useState(0);
  const [total_in_stock, setTotalInStock] = useState(0);
  const [total_revenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    setTotalOverflow(0);
    setTotalAdd(0);
    setTotalReturn(0);
    setTotalSold(0);
    setTotalRestock(0);
    setTotalInStock(0);
    setTotalRevenue(0);
    if (rows)
      rows.map((row) => {
        setTotalOverflow(
          (prev) => prev + (row.overflow ? parseInt(row.overflow) : 0)
        );
        setTotalAdd(
          (prev) =>
            prev +
            (row.total_add_quantity ? parseInt(row.total_add_quantity) : 0)
        );
        setTotalReturn(
          (prev) =>
            prev +
            (row.total_return_quantity
              ? parseInt(row.total_return_quantity)
              : 0)
        );
        setTotalSold(
          (prev) => prev + (row.sold_quantity ? parseInt(row.sold_quantity) : 0)
        );
        setTotalRestock(
          (prev) =>
            prev +
            (row.total_restock_quantity
              ? parseInt(row.total_restock_quantity)
              : 0)
        );
        setTotalInStock(
          (prev) => prev + (row.in_stock ? parseInt(row.in_stock) : 0)
        );
        setTotalRevenue(
          (prev) =>
            prev + (row.in_stock_revenue ? parseInt(row.in_stock_revenue) : 0)
        );
      });
  }, [rows]);

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
      field: "overflow",
      headerName: "ยกมา",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
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
    {
      field: "total_restock_quantity",
      headerName: "ปรับสต็อก",
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
      renderCell: (params) => {
        return <p>{params.row.in_stock_revenue.toFixed(2)}</p>;
      },
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
        pageSizeOptions={[20, 50, 100, 250]}
        disableColumnFilter
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: {
            rows,
            columns,
            month,
            supplier,
            total_overflow,
            total_add,
            total_return,
            total_sold,
            total_restock,
            total_in_stock,
            total_revenue,
          },
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
