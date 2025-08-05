import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box, TextField, IconButton } from "@mui/material";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import LoadingScreen from "../../Loading/LoadingScreen";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import SupplierEditDialog from "./SupplierEditDialog";
import { toast } from "react-hot-toast";
import ItemSelect from "../Books/ItemSelect";
import { useBookContext } from "../../../contexts/admin/BookContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  height: "fit",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
};

const colDict = {
  supplier_name: "ชื่อย่อ",
  product: "ประเภทสินค้า",
  full_name: "ชื่อเต็ม",
  percent: "เปอร์เซ็นต์",
  phone_number: "เบอร์โทร",
  sales_email: "อีเมลฝ่ายขาย",
  accountant_email: "อีเมลฝ่ายบัญชี",
  tax_number: "เลขภาษี",
  address: "ที่อยู่",
  bank: "ธนาคาร",
  account: "บัญชี",
  deposit: "มัดจำ",
};

const SupplierForm = ({ handleChange }) => {
  const { item } = useBookContext();
  const colNames = [
    "ชื่อย่อ",
    "",
    "ชื่อเต็ม",
    "เปอร์เซ็นต์",
    "เบอร์โทร",
    "อีเมลฝ่ายขาย",
    "อีเมลฝ่ายบัญชี",
    "เลขภาษี",
    "ที่อยู่",
    "ธนาคาร",
    "บัญชี",
    "มัดจำ",
  ];

  const initialValues = {
    supplier_name: "",
    product: "",
    full_name: "",
    percent: "",
    phone_number: "",
    sales_email: "",
    accountant_email: "",
    tax_number: "",
    address: "",
    bank: "",
    account: "",
    deposit: "",
  };

  const validationSchema = Yup.object({
    supplier_name: Yup.string().required("Required"),
    product: Yup.string(),
    full_name: Yup.string(),
    percent: Yup.number(),
    phone_number: Yup.string(),
    sales_email: Yup.string(),
    accountant_email: Yup.string(),
    tax_number: Yup.string(),
    address: Yup.string(),
    bank: Yup.string(),
    account: Yup.string(),
    deposit: Yup.number(),
  });

  const handleSubmit = async (values) => {
    if (!item) return toast.error("เลือกประเภทสินค้า");

    const data = { ...values, product: item };

    await axios
      .post(import.meta.env.VITE_API_BASEURL + "/supplier/add", data)
      .then((res) => {
        toast.success("เพิ่มตัวแทนจำหน่ายเรียบร้อย");
      })
      .catch((err) => {
        console.log(err);
        toast.error("เกิดข้อผิดพลาด");
      });
    handleChange();
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="mb-6 flex gap-5 w-full">
            <div className="grid gap-6 mb-6 md:grid-cols-2 ">
              {Object.keys(initialValues).map((col, i) => (
                <div key={i}>
                  <label
                    htmlFor={col}
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    {colNames[i]}
                  </label>
                  {col == "product" ? (
                    <ItemSelect />
                  ) : (
                    <>
                      <Field
                        type="text"
                        name={col}
                        className="w-[350px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      />

                      <ErrorMessage
                        component="span"
                        name={col}
                        className="text-red-500 text-sm"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-5 justify-center pt-5">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              เพิ่มตัวแทนจำหน่าย
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: "space-between",
        display: "flex",
        alignItems: "flex-start",
        flexWrap: "wrap",
      },
      textField: {
        [theme.breakpoints.down("xs")]: {
          width: "100%",
        },
        margin: theme.spacing(1, 0.5, 1.5),
        "& .MuiSvgIcon-root": {
          marginRight: theme.spacing(0.5),
        },
        "& .MuiInput-underline:before": {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
    }),
  { defaultTheme }
);

function QuickSearchToolbar(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        className={classes.textField}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

const GridToolbar = ({ refetchData }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div className="px-4">
      <div className="flex gap-4">
        <button
          onClick={handleClick}
          className="flex justify-center items-center gap-1 text-blue-500"
        >
          <AddIcon />
          เพิ่มตัวแทนจำหน่าย
        </button>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
            >
              <CloseIcon fontSize="medium" />
            </button>
            <div className="flex justify-center items-center p-16">
              <SupplierForm
                handleChange={() => {
                  setOpen(false);
                  refetchData();
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

function CustomToolbar({ value, onChange, clearSearch, refetchData }) {
  return (
    <GridToolbarContainer className="flex justify-between">
      <GridToolbar refetchData={refetchData} />
      <QuickSearchToolbar
        value={value}
        onChange={onChange}
        clearSearch={clearSearch}
      />
    </GridToolbarContainer>
  );
}

const SupplierModal = ({ onClose, row }) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, padding: 4, paddingInline: 8 }}>
        <button
          onClick={onClose}
          className="absolute right-7 top-7 text-gray-400 hover:text-red-500"
        >
          <CloseIcon fontSize="medium" />
        </button>
        <div className="grid grid-cols-2 m-auto gap-y-2">
          {Object.keys(row).map((item, i) => {
            return (
              item !== "id" &&
              item !== "supplier_id" &&
              item !== "product" && (
                <p key={i} className="">
                  {colDict[item]} : {row[item]}
                </p>
              )
            );
          })}
        </div>
      </Box>
    </Modal>
  );
};

const ManageSuppliers = () => {
  const [rows, setRows] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const url = "/book/table/suppliers";
  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };
  const { isLoading, error, data, refetch } = useQuery(
    ["suppliers table"],
    fetchMyData
  );

  useEffect(() => {
    if (data?.length > 0) {
      const updatedRows = data.map((item, i) => {
        return {
          ...item,
          id: i + 1,
        };
      });
      setRows(updatedRows);
      setOriginalData(updatedRows);
    }
  }, [data]);

  const handleEdit = (id) => {
    const supplier = rows.find((row) => row.id === id);
    setModalOpen(true);
    setEditSupplier(supplier);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const columns = [
    {
      field: "edit",
      headerName: "แก้ไข",
      width: 75,
      renderCell: (params) => {
        return (
          <div className="opacity-30 hover:opacity-100">
            <IconButton onClick={() => handleEdit(params.id)}>
              <EditIcon />
            </IconButton>
          </div>
        );
      },
    },
    { field: "supplier_name", headerName: "ชื่อย่อ", width: 120 },
    { field: "full_name", headerName: "ชื่อเต็ม", width: 180 },
    {
      field: "percent",
      headerName: "เปอร์เซ็นต์",
      width: 90,
      renderCell: (params) => {
        return <p>{params.row.percent}%</p>;
      },
    },
    { field: "phone_number", headerName: "เบอร์โทร", width: 150 },
    { field: "accountant_email", headerName: "อีเมลฝ่ายบัญชี", width: 200 },
    { field: "sales_email", headerName: "อีเมลฝ่ายขาย", width: 200 },
    // { field: "address", headerName: "ที่อยู่", width: 200 },
    { field: "bank", headerName: "ธนาคาร", width: 75 },
    { field: "account", headerName: "บัญชี", width: 150 },
    { field: "deposit", headerName: "มัดจำ", width: 150 },
    // { field: "tax_number", headerName: "เลขภาษี", width: 150 },
  ];

  const [searchText, setSearchText] = useState("");
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = originalData.filter((row) => {
      return Object.keys(row).some((field) => {
        if (row[field]) {
          return searchRegex.test(row[field].toString());
        }
        return;
      });
    });
    setRows(filteredRows);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full ">
      <div className="">
        {data && (
          <Box sx={{ maxHeight: "90vh", width: "100%", margin: "auto" }}>
            <DataGrid
              disableDensitySelector
              onCellClick={(params) => {
                if (params.field !== "edit") {
                  setOpen(true);
                  setCurrentRow(params.row);
                }
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
              pageSizeOptions={[10, 20, 50]}
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                toolbar: {
                  value: searchText,
                  onChange: (event) => requestSearch(event.target.value),
                  clearSearch: () => requestSearch(""),
                  refetchData: () => refetch(),
                },
              }}
            />
            {modalOpen && (
              <SupplierEditDialog
                handleClose={handleCloseModal}
                supplier={editSupplier}
                refetchData={() => refetch()}
              />
            )}
          </Box>
        )}
      </div>
      {open && (
        <SupplierModal onClose={() => setOpen(false)} row={currentRow} />
      )}
    </div>
  );
};

export default ManageSuppliers;
