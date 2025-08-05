import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Box, TextField, IconButton, createTheme } from "@mui/material";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DiscountIcon from "@mui/icons-material/Discount";
import Modal from "@mui/material/Modal";
import PublisherEditDialog from "./PublisherEditDialog";
import LoadingScreen from "../../Loading/LoadingScreen";
import { createStyles, makeStyles } from "@mui/styles";
import PublisherSupplierForm from "./PublisherForm";
import DiscountForm from "./DiscountForm";
import { useBookContext } from "../../../contexts/admin/BookContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  padding: 4,
};

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

function QuickSearchToolbar({ value, onChange, clearSearch }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TextField
        variant="standard"
        value={value}
        onChange={onChange}
        placeholder="Search…"
        className={classes.textField}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: value ? "visible" : "hidden" }}
              onClick={clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

const GridToolbar = ({
  refetchData,
  rowSelectionModel,
  setRowSelectionModel,
  rows,
}) => {
  const [addModal, setAddModal] = useState(false);
  const [discountModal, setDiscountModal] = useState(false);

  return (
    <div className="px-4">
      <div className="flex gap-4">
        <button
          onClick={() => setAddModal(true)}
          className="flex justify-center items-center gap-1 text-blue-500"
        >
          <AddIcon />
          เพิ่มสนพ.
        </button>
        <button
          onClick={() => setDiscountModal(true)}
          className="flex justify-center items-center gap-1 text-blue-500 disabled:text-gray-500"
          disabled={rowSelectionModel.length === 0}
        >
          <DiscountIcon />
          กำหนดส่วนลด
        </button>
      </div>

      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button
            onClick={() => setAddModal(false)}
            className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
          >
            <CloseIcon fontSize="medium" />
          </button>
          <div className="flex justify-center items-center p-16">
            <PublisherSupplierForm
              handleChange={() => {
                setAddModal(false);
                refetchData();
              }}
            />
          </div>
        </Box>
      </Modal>

      <Modal
        open={discountModal}
        onClose={() => setDiscountModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button
            onClick={() => setDiscountModal(false)}
            className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
          >
            <CloseIcon fontSize="medium" />
          </button>
          <div className="flex justify-center items-center p-16">
            <DiscountForm
              publishers={rows.filter((row) =>
                rowSelectionModel.includes(row.id)
              )}
              onFinish={() => {
                setDiscountModal(false);
                setRowSelectionModel([]);
                refetchData();
              }}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

function CustomToolbar({
  value,
  onChange,
  clearSearch,
  refetchData,
  rowSelectionModel,
  setRowSelectionModel,
  rows,
}) {
  return (
    <GridToolbarContainer className="flex justify-between">
      <GridToolbar
        refetchData={refetchData}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        rows={rows}
      />
      <QuickSearchToolbar
        value={value}
        onChange={onChange}
        clearSearch={clearSearch}
      />
    </GridToolbarContainer>
  );
}

const ManagePublishers = () => {
  const [rows, setRows] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const { suppliers } = useBookContext();

  const fetchPublishersData = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASEURL + "/publisher/getall"
    );
    return res.data;
  };

  const { isLoading, data, refetch } = useQuery(
    ["publishers table"],
    fetchPublishersData
  );

  useEffect(() => {
    if (data?.length > 0) {
      const updatedRows = data.map((item, i) => ({
        ...item,
        id: i + 1,
      }));
      setRows(updatedRows);
      setOriginalData(updatedRows);
    }
  }, [data]);

  function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = originalData.filter((row) =>
      Object.keys(row).some((field) =>
        row[field] ? searchRegex.test(row[field].toString()) : false
      )
    );
    setRows(filteredRows);
  };

  if (isLoading) return <LoadingScreen />;

  const columns = [
    { field: "supplier_name", headerName: "ตัวแทนจำหน่าย", width: 200 },
    { field: "publisher_name", headerName: "ชื่อสำนักพิมพ์", width: 200 },
    {
      field: "publisher_discount",
      headerName: "ส่วนลด (%)",
      width: 100,
      renderCell: (params) => <p>{params.row.publisher_discount}%</p>,
    },
    {
      field: "discount_start",
      headerName: "วันที่เริ่มส่วนลด",
      width: 200,
      renderCell: (params) => {
        if (!params.row.discount_start) return null;
        return (
          <p>
            {new Date(params.row.discount_start).toLocaleDateString("en-GB")}
          </p>
        );
      },
    },
    {
      field: "discount_end",
      headerName: "วันที่สิ้นสุดส่วนลด",
      width: 200,
      renderCell: (params) => {
        if (!params.row.discount_end) return null;
        return (
          <p>{new Date(params.row.discount_end).toLocaleDateString("en-GB")}</p>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <Box sx={{ maxHeight: "90vh", width: "100%", margin: "auto" }}>
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newSelectionModel) => {
            console.log(newSelectionModel);
            setRowSelectionModel(newSelectionModel);
          }}
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
              rowSelectionModel,
              setRowSelectionModel,
              rows,
            },
          }}
        />
      </Box>
    </div>
  );
};

export default ManagePublishers;
