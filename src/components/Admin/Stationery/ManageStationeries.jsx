import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import StationeryEditDialog from "./StationeryEditDialog";
import EditIcon from "@mui/icons-material/Edit";
import LoadingScreen from "../../Loading/LoadingScreen";
import ItemForm from "../Books/ItemForm";
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { BookContext } from "../Books/Book";
import AddIcon from "@mui/icons-material/Add";
import SupplierSelect from "../Books/SupplierSelect";
import CloseIcon from "@mui/icons-material/Close";
import ManageStocks, { StockSuccessModal } from "../Stocks/ManageStocks";

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
      <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
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

const GridToolbar = ({ refetchData, rowSelectionModel, onFinish }) => {
  const [open, setOpen] = useState(false);
  const [openActionModal, setOpenActionModal] = useState(false);
  const [type, setType] = useState("");
  const [modalData, setModalData] = useState("");
  const [openDone, setOpenDone] = useState(false);
  const { supplier, setSupplier } = useContext(BookContext);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div className="pb-4">
      <div className="flex gap-5">
        <button
          onClick={handleClick}
          className={`flex justify-center items-center gap-1 text-blue-500 p-2 rounded-lg h-12 transition-all ${
            !supplier || supplier.supplier_name == "All"
              ? "text-gray-400 hover:bg-none"
              : "hover:bg-gray-200"
          }`}
          disabled={!supplier || supplier.supplier_name == "All"}
        >
          <AddIcon />
          เพิ่มสินค้า
        </button>
        <button
          onClick={() => {
            setType("order");
            setOpenActionModal(true);
          }}
          className={`flex justify-center items-center gap-1 text-blue-500 p-2 rounded-lg h-12 ${
            rowSelectionModel.length == 0
              ? "text-gray-400 hover:bg-none"
              : "hover:bg-gray-200"
          }`}
          disabled={rowSelectionModel.length == 0}
        >
          สั่งสินค้า
        </button>
        <button
          onClick={() => {
            setType("add");
            setOpenActionModal(true);
          }}
          className={`flex justify-center items-center gap-1 text-blue-500 p-2 rounded-lg h-12 ${
            rowSelectionModel.length == 0
              ? "text-gray-400 hover:bg-none"
              : "hover:bg-gray-200"
          }`}
          disabled={rowSelectionModel.length == 0}
        >
          รับสินค้า
        </button>
        <button
          onClick={() => {
            setType("return");
            setOpenActionModal(true);
          }}
          className={`flex justify-center items-center gap-1 text-blue-500 p-2 rounded-lg h-12 ${
            rowSelectionModel.length == 0
              ? "text-gray-400 hover:bg-none"
              : "hover:bg-gray-200"
          }`}
          disabled={rowSelectionModel.length == 0}
        >
          คืนสินค้า
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
            <div className="p-10">
              <ItemForm
                onFinish={() => {
                  setOpen(false);
                  if (refetchData) refetchData();
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openActionModal}
        onClose={() => setOpenActionModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: "fit" }}>
          <ManageStocks
            type={type}
            supplier={supplier}
            closeModal={() => setOpenActionModal(false)}
            rowSelectionModel={rowSelectionModel}
            onFinish={(modalObj) => {
              setModalData(modalObj);
              setOpenDone(true);
              setType("");
              setSupplier("");
              setOpenActionModal(false);
              if (refetchData) refetchData();
              if (onFinish) onFinish();
            }}
          />
        </Box>
      </Modal>
      <StockSuccessModal
        modalData={modalData}
        openDone={openDone}
        handleClose={() => setOpenDone(false)}
      />
    </div>
  );
};

function CustomToolbar({
  value,
  onChange,
  clearSearch,
  refetchData,
  rowSelectionModel,
  rows,
  onFinish,
}) {
  return (
    <GridToolbarContainer className="flex justify-between">
      <GridToolbar
        refetchData={refetchData}
        rowSelectionModel={rowSelectionModel}
        rows={rows}
        onFinish={onFinish}
      />
      <QuickSearchToolbar
        value={value}
        onChange={onChange}
        clearSearch={clearSearch}
      />
    </GridToolbarContainer>
  );
}

const ManageStationeries = () => {
  const [orginalData, setOriginalData] = useState([]);
  const { supplier, setSupplier } = useContext(BookContext);
  const [searchText, setSearchText] = useState("");
  const [persistedSelection, setPersistedSelection] = useState([]);

  const fetchMyData = async () => {
    const url = `/stationery/getAll${
      supplier
        ? "?supplier_name=" + encodeURIComponent(supplier.supplier_name)
        : ""
    }`;
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };
  const { isLoading, error, data, refetch } = useQuery(
    ["stationery table", supplier],
    fetchMyData
  );

  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    setPersistedSelection([]);
  }, [supplier]);

  useEffect(() => {
    if (data?.length >= 0) {
      const updatedRows = data.map((item) => {
        return { ...item, id: item.ISBN, isEditable: false };
      });
      setRows(updatedRows);
      setOriginalData(updatedRows);
    }
  }, [data]);

  const handleSave = (id) => {
    const book = rows.find((row) => row.id === id);
    setModalOpen(true);
    setEditBook(book);
  };

  const handleCloseModal = (success) => {
    if (success) refetch();
    setModalOpen(false);
  };

  const isSelected = (rowId) => {
    return persistedSelection.some((item) => item.id === rowId);
  };

  useEffect(() => {
    if (data?.length > 0) {
      const updatedRows = data.map((item) => {
        return { ...item, id: item.ISBN, isEditable: false };
      });

      const sortedRows = updatedRows.sort((a, b) => {
        if (isSelected(a.id) && !isSelected(b.id)) {
          return -1;
        }
        if (!isSelected(a.id) && isSelected(b.id)) {
          return 1;
        }
        return 0;
      });

      setRows(sortedRows);
      setOriginalData(sortedRows);
    }
  }, [data, persistedSelection]);

  useEffect(() => {
    const sortedRows = [...rows].sort((a, b) => {
      if (isSelected(a.id) && !isSelected(b.id)) {
        return -1;
      }
      if (!isSelected(a.id) && isSelected(b.id)) {
        return 1;
      }
      return 0;
    });

    setRows(sortedRows);
  }, [persistedSelection]);

  const handleCustomSelection = (e, row) => {
    if (e.target.checked) {
      setPersistedSelection((prev) => [...prev, row]);
    } else {
      setPersistedSelection((prev) =>
        prev.filter((item) => item.id !== row.id)
      );
    }
  };

  const columns = [
    {
      field: "customSelected",
      headerName: "เลือก",
      width: 75,
      renderCell: (params) => {
        return (
          <Checkbox
            disabled={!supplier || supplier.supplier_name == "All"}
            checked={isSelected(params.id)}
            onChange={(e) => {
              handleCustomSelection(e, params.row);
            }}
          />
        );
      },
    },
    { field: "id", headerName: "ISBN", width: 150 },
    {
      field: "coverImg",
      headerName: "รูปปก",
      width: 150,
      renderCell: (params) => {
        if (params.row.cover_img) {
          const uid = params.row.cover_img?.split("=")[1];
          const url = `https://drive.google.com/thumbnail?id=${uid}&sz=w1000`;
          return <img src={url} className="object-cover h-full w-2/3" />;
        } else
          return (
            <div className="h-full w-2/3 text-gray-400 bg-gray-200 items-center flex justify-center">
              No Image
            </div>
          );
      },
    },
    {
      field: "title",
      headerName: "ชื่อสินค้า",
      width: 250,
    },
    {
      field: "supplier_name",
      headerName: "ตัวแทนจำหน่าย",
      width: 150,
    },
    {
      field: "price",
      headerName: "ราคา (฿)",
      width: 150,
      sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
    },
    {
      field: "in_stock",
      headerName: "สต็อก",
      width: 100,
    },
    {
      field: "edit",
      headerName: "แก้ไข",
      width: 75,
      renderCell: (params) => {
        return (
          <div className="opacity-30 hover:opacity-100">
            <IconButton onClick={() => handleSave(params.id)}>
              <EditIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = orginalData.filter((row) => {
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
    <>
      {data && (
        <Box sx={{ maxHeight: "90vh", width: "70%", margin: "auto" }}>
          <DataGrid
            // rowHeight={105}
            getRowSpacing={(params) => {
              return {
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              };
            }}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 15,
                },
              },
            }}
            pageSizeOptions={[15]}
            slots={{
              toolbar: CustomToolbar,
            }}
            slotProps={{
              toolbar: {
                value: searchText,
                onChange: (event) => requestSearch(event.target.value),
                clearSearch: () => requestSearch(""),
                refetchData: () => refetch(),
                rowSelectionModel: persistedSelection,
                rows: rows,
                onFinish: () => {
                  setPersistedSelection([]);
                  setSupplier("");
                },
              },
            }}
            disableColumnFilter
            disableDensitySelector
          />
          {modalOpen && (
            <StationeryEditDialog
              handleClose={(success) => {
                handleCloseModal(success);
                if (success) refetch();
              }}
              book={editBook}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default ManageStationeries;
