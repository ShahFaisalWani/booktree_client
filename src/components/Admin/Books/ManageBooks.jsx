import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { toast } from "react-hot-toast";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import Checkbox from "@mui/material/Checkbox";
import LoadingScreen from "../../Loading/LoadingScreen";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import BookForm from "./BookForm";
import ManageStocks, {
  StockSuccessModal,
  handleExport,
} from "../Stocks/ManageStocks";
import AddExcel from "./AddExcel";
import BooksList from "../BooksList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import { Button } from "@mui/material";
import { useBookContext } from "../../../contexts/admin/BookContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  overflow: "scroll",
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

const GridToolbar = ({
  refetchBooks,
  rowSelection,
  setRowSelection,
  onFinish,
}) => {
  const [open, setOpen] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);
  const excelRef = useRef(null);
  const orderExcelRef = useRef(null);
  const bookListRef = useRef(null);
  const [excelBooks, setExcelBooks] = useState(false);
  const [openActionModal, setOpenActionModal] = useState(false);
  const [type, setType] = useState("");
  const [modalData, setModalData] = useState("");
  const [openDone, setOpenDone] = useState(false);
  const { supplier, setSupplier } = useBookContext();

  const handleClick = () => {
    setOpen(true);
  };
  const handleClickExcel = () => {
    excelRef.current.openFileInput();
  };

  const addExcelFunc = (books) => {
    if (books) {
      setExcelBooks(books);
      setOpenExcel(true);
    }
  };

  const clickOrderExcel = () => {
    setType("order");
    orderExcelRef.current.openFileInput();
  };
  const clickAddExcel = () => {
    setType("add");
    orderExcelRef.current.openFileInput();
  };

  const clickReturnExcel = () => {
    setType("return");
    orderExcelRef.current.openFileInput();
  };

  const handleExportExcel = () => {
    const data = [
      {
        A: "ที่",
        B: "ISBN",
        C: "ชื่อ",
        D: "ตัวแทนจำหน่าย",
        E: "%",
        F: "ราคา",
        G: "หลังหัก %",
      },
      ...rowSelection.map((stock, i) => ({
        A: i + 1,
        B: stock.ISBN,
        C: stock.title,
        D: stock.supplier_name,
        E: stock.percent,
        F: stock.price,
        G: (stock.price * (1 - stock.percent / 100)).toFixed(2),
      })),
    ];
    const ws = XLSX.utils.json_to_sheet(data, {
      header: ["A", "B", "C"],
      skipHeader: true,
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Books");

    XLSX.writeFile(wb, "Export Excel" + ".xlsx");
  };

  const clickExportExcel = () => {
    handleExportExcel();
  };

  const orderExcelFunc = async (books) => {
    const newBooks = books.filter(
      (book) => !rowSelection.some((selected) => selected.id === book.id)
    );

    const mergedSelection = [...rowSelection, ...newBooks];
    if (books) {
      setRowSelection(mergedSelection);
      setOpenActionModal(true);
      setTimeout(() => {
        bookListRef.current.submitBooks();
      }, 100);
    }
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
          เพิ่มหนังสือ
        </button>
        <button
          onClick={handleClickExcel}
          className={`flex justify-center items-center gap-1 text-blue-500 p-2 rounded-lg h-12 transition-all ${
            !supplier || supplier.supplier_name == "All"
              ? "text-gray-400 hover:bg-none"
              : "hover:bg-gray-200"
          }`}
          disabled={!supplier || supplier.supplier_name == "All"}
        >
          <AddIcon />
          เพิ่มจาก Excel
        </button>
        <button
          onClick={() => {
            setType("order");
            setOpenActionModal(true);
          }}
          className={`flex justify-center items-center gap-1 text-blue-500 p-2 rounded-lg h-12 transition-all ${
            rowSelection.length == 0 ||
            !supplier ||
            supplier.supplier_name == "All"
              ? "text-gray-400 hover:bg-none"
              : "hover:bg-gray-200"
          }`}
          disabled={
            rowSelection.length == 0 ||
            !supplier ||
            supplier.supplier_name == "All"
          }
        >
          สั่งสินค้า
        </button>
        {/* <button
          onClick={() => {
            setType("add");
            setOpenActionModal(true);
          }}
          className={`flex justify-center items-center gap-1 text-blue-500 p-2 rounded-lg h-12 transition-all ${
            rowSelection.length == 0 ||
            !supplier ||
            supplier.supplier_name == "All"
              ? "text-gray-400 hover:bg-none"
              : "hover:bg-gray-200"
          }`}
          disabled={
            rowSelection.length == 0 ||
            !supplier ||
            supplier.supplier_name == "All"
          }
        >
          รับสินค้า
        </button> */}
        {/* <button
          onClick={() => {
            setType("return");
            setOpenActionModal(true);
          }}
          className={`flex justify-center items-center gap-1 text-blue-500 p-2 rounded-lg h-12 transition-all ${
            rowSelection.length == 0 ||
            !supplier ||
            supplier.supplier_name == "All"
              ? "text-gray-400 hover:bg-none"
              : "hover:bg-gray-200"
          }`}
          disabled={
            rowSelection.length == 0 ||
            !supplier ||
            supplier.supplier_name == "All"
          }
        >
          คืนสินค้า
        </button> */}
        <button
          onClick={clickOrderExcel}
          className={`flex justify-center items-center gap-1 p-2 rounded-lg h-12 transition-all ${
            !supplier || supplier.supplier_name == "All"
              ? "text-gray-400 hover:bg-none"
              : "text-blue-500 hover:bg-gray-200"
          }`}
          disabled={!supplier || supplier.supplier_name == "All"}
        >
          <AddIcon />
          สั่ง Excel
        </button>
        {/* <button
          onClick={clickAddExcel}
          className={`flex justify-center items-center gap-1 p-2 rounded-lg h-12 transition-all ${
            !supplier || supplier.supplier_name == "All"
              ? "text-gray-400 hover:bg-none"
              : "text-green-500 hover:bg-gray-200"
          }`}
          disabled={!supplier || supplier.supplier_name == "All"}
        >
          <AddIcon />
          รับ Excel
        </button> */}
        {/* <button
          onClick={clickReturnExcel}
          className={`flex justify-center items-center gap-1 p-2 rounded-lg h-12 transition-all ${
            !supplier || supplier.supplier_name == "All"
              ? "text-gray-400 hover:bg-none"
              : "text-red-500 hover:bg-gray-200"
          }`}
          disabled={!supplier || supplier.supplier_name == "All"}
        >
          <AddIcon />
          คืน Excel
        </button> */}
        <button
          onClick={clickExportExcel}
          className={`flex justify-center items-center gap-1 p-2 rounded-lg h-12 transition-all ${
            rowSelection.length == 0
              ? "text-gray-400 hover:bg-none"
              : "text-blue-500 hover:bg-gray-200"
          }`}
          disabled={rowSelection.length == 0}
        >
          <FileDownloadIcon />
          Export Excel
        </button>
      </div>
      {/* Add Book Modal */}
      {open && (
        <BookForm
          onSuccess={() => {
            setOpen(false);
            if (refetchBooks) refetchBooks();
          }}
          onCancel={() => setOpen(false)}
          title="เพิ่มหนังสือ"
        />
      )}

      <AddExcel
        ref={excelRef}
        onChange={(books) => {
          addExcelFunc(books);
        }}
      />
      <AddExcel
        ref={orderExcelRef}
        onChange={(books) => orderExcelFunc(books)}
      />
      <BooksList
        hidden
        excelBooks={rowSelection}
        ref={bookListRef}
        onFinish={() => {
          if (refetchBooks) refetchBooks();
        }}
      />
      <Modal
        open={openExcel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: "95%" }}>
          <div>
            <button
              onClick={() => {
                setOpenExcel(false);
                if (refetchBooks) refetchBooks();
              }}
              className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
            >
              <CloseIcon fontSize="medium" />
            </button>
            <div className="p-10 mt-10">
              <BooksList
                excelBooks={excelBooks}
                onFinish={() => {
                  setOpenExcel(false);
                  if (refetchBooks) refetchBooks();
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openActionModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: "fit" }}>
          <ManageStocks
            type={type}
            supplier={supplier}
            closeModal={() => setOpenActionModal(false)}
            rowSelectionModel={rowSelection}
            onFinish={(modalObj) => {
              setModalData(modalObj);
              setOpenDone(true);
              setType("");
              setSupplier("");
              setOpenActionModal(false);
              if (refetchBooks) refetchBooks();
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
  refetchBooks,
  rowSelectionModel,
  setRowSelectionModel,
  onFinish,
}) {
  return (
    <GridToolbarContainer className="flex justify-between">
      <GridToolbar
        refetchBooks={refetchBooks}
        rowSelection={rowSelectionModel}
        setRowSelection={setRowSelectionModel}
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

const ManageBooks = () => {
  const [originalData, setOriginalData] = useState([]);
  const {
    supplier,
    setSupplier,
    suppliers,
    getCachedBooks,
    invalidateBooksCache,
  } = useBookContext();
  const [searchText, setSearchText] = useState("");
  const [persistedSelection, setPersistedSelection] = useState([]);

  const fetchMyData = async () => {
    const url = `/book/getall${
      supplier
        ? "?supplier_name=" + encodeURIComponent(supplier.supplier_name)
        : ""
    }`;
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, error, data, refetch } = useQuery(
    ["books table", supplier],
    fetchMyData,
    {
      refetchOnWindowFocus: false,
      staleTime: 3 * 60 * 1000, // 3 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes - longer cache for books
      // Keep previous data while fetching new data
      keepPreviousData: true,
      // Don't retry if supplier is not set
      enabled: true,
      // Prefer cache on mount - only refetch if cache is stale
      refetchOnMount: false,
    }
  );

  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [copyBook, setCopyBook] = useState(null);
  const [isCopying, setIsCopying] = useState(false);

  // Define isSelected function early since it's used in useEffect
  const isSelected = (rowId) => {
    return persistedSelection.some((item) => item.id === rowId);
  };

  // Single effect to handle all row updates and sorting
  useEffect(() => {
    let updatedRows = [];

    if (data !== undefined) {
      // Data is loaded (could be empty array or populated array)
      updatedRows = data.map((item) => {
        return { ...item, id: item.ISBN, isEditable: false };
      });
    } else if (getCachedBooks) {
      // Fallback to cache if no fresh data
      const cachedBooks = getCachedBooks(supplier);
      if (cachedBooks?.length > 0) {
        updatedRows = cachedBooks.map((item) => {
          return { ...item, id: item.ISBN, isEditable: false };
        });
      }
    }

    // Sort rows to put selected items first (only if there are rows)
    if (updatedRows.length > 0) {
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
    } else {
      // Clear rows when no data is available
      setRows([]);
      setOriginalData([]);
    }
  }, [data, supplier, getCachedBooks, persistedSelection]);

  const handleEdit = (id) => {
    const book = rows.find((row) => row.id === id);
    const selectedSupplier = suppliers.find(
      (supplier) => supplier.supplier_name === book.supplier_name
    );
    // setSupplier(selectedSupplier);
    setEditBook(book);
    setModalOpen(true);
  };

  const handleAddCopy = (id) => {
    const book = rows.find((row) => row.id === id);
    setCopyBook(book);
    setAddModalOpen(true);
  };

  const handleConfirmCopy = async () => {
    if (!copyBook) return;

    try {
      setIsCopying(true);

      await axios.post(
        import.meta.env.VITE_API_BASEURL + "/book/takeover",
        copyBook
      );

      toast.success("คัดลอกหนังสือเป็น Booktree สำเร็จ");
      setSupplier({ supplier_name: "Booktree" });
      setAddModalOpen(false);
      setCopyBook(null);
      refetch();
    } catch (error) {
      console.error("Error copying book:", error);
      toast.error("เกิดข้อผิดพลาดในการคัดลอกหนังสือ");
    } finally {
      setIsCopying(false);
    }
  };

  useEffect(() => {
    setPersistedSelection([]);
  }, [supplier]);

  const handleChange = async (e, ISBN) => {
    const index = rows.findIndex((book) => book.ISBN === ISBN);

    if (index !== -1) {
      setRows((prev) => [
        ...prev.slice(0, index),
        { ...prev[index], recommend: e.target.checked },
        ...prev.slice(index + 1),
      ]);
    } else {
      return console.log("Book not found");
    }

    await axios.post(import.meta.env.VITE_API_BASEURL + "/book/setrecommend", {
      ISBN: ISBN,
      recommend: e.target.checked ? 1 : 0,
    });
  };

  const handleCloseModal = (success) => {
    setModalOpen(false);
    if (success) refetch();
  };

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
      width: 50,
      renderCell: (params) => {
        return (
          <Checkbox
            // disabled={!supplier || supplier.supplier_name == "All"}
            checked={isSelected(params.id)}
            onChange={(e) => {
              handleCustomSelection(e, params.row);
            }}
          />
        );
      },
    },
    {
      field: "edit",
      headerName: "แก้ไข",
      width: 50,
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
    { field: "ISBN", headerName: "ISBN", width: 150 },
    // {
    //   field: "coverImg",
    //   headerName: "รูปปก",
    //   width: 150,
    //   renderCell: (params) => {
    //     if (params.row.cover_img) {
    //       const uid = params.row.cover_img?.split("=")[1];
    //       const url = `https://drive.google.com/thumbnail?id=${uid}&sz=w1000`;
    //       return <img src={url} className="object-cover h-full w-2/3" />;
    //     } else
    //       return (
    //         <div className="h-full w-2/3 text-gray-400 bg-gray-200 items-center flex justify-center">
    //           No Image
    //         </div>
    //       );
    //   },
    // },
    {
      field: "title",
      headerName: "ชื่อเรื่อง",
      width: 250,
    },
    { field: "genre", headerName: "หมวดหมู่", width: 150 },
    {
      field: "supplier_name",
      headerName: "ตัวแทนจำหน่าย",
      width: 150,
    },
    { field: "publisher", headerName: "สนพ.", width: 150 },
    {
      field: "base_price",
      headerName: "ต้นทุน",
      width: 100,
      sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
    },
    {
      field: "price",
      headerName: "ราคา",
      width: 100,
      sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
    },
    {
      field: "publisher_discount",
      headerName: "ส่วนลด",
      width: 75,
      renderCell: (params) => {
        if (params.row.publisher_discount > 0)
          return (
            <span className="text-right">
              {parseInt(params.row.publisher_discount).toString()}%
            </span>
          );
        else return <span>-</span>;
      },
    },
    {
      field: "net_price",
      headerName: "หลังหักส่วนลด",
      width: 100,
      renderCell: (params) => {
        return (
          <span className="text-right">
            {(
              params.row.price *
              (1 - params.row.publisher_discount / 100)
            ).toFixed(2)}
          </span>
        );
      },
    },
    {
      field: "in_stock",
      headerName: "สต็อก",
      width: 75,
    },
    {
      field: "recommend",
      headerName: "แนะนำ",
      width: 80,
      renderCell: (params) => {
        return (
          <Checkbox
            checked={Boolean(params.row.recommend)}
            onChange={(e) => handleChange(e, params.row.ISBN)}
          />
        );
      },
    },
    {
      field: "swap",
      headerName: "รับเป็น Booktree",
      width: 115,
      renderCell: (params) => {
        return (
          <div className="m-auto">
            <IconButton onClick={() => handleAddCopy(params.id)}>
              <SwapHorizontalCircleIcon color="info" />
            </IconButton>
          </div>
        );
      },
    },
  ];

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
    <>
      <Box sx={{ width: "100%", margin: "auto" }}>
        <DataGrid
          rowHeight={105}
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
                pageSize: 30,
              },
            },
          }}
          pageSizeOptions={[30]}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              value: searchText,
              onChange: (event) => requestSearch(event.target.value),
              clearSearch: () => requestSearch(""),
              refetchBooks: () => refetch(),
              rowSelectionModel: persistedSelection,
              setRowSelectionModel: setPersistedSelection,
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
        {/* Edit Book Modal */}
        {modalOpen && (
          <BookForm
            book={editBook}
            onSuccess={() => {
              handleCloseModal(true);
              refetch();
            }}
            onCancel={() => handleCloseModal(false)}
            title="แก้ไขหนังสือ"
          />
        )}

        {/* Copy Book Confirmation Modal */}
        {addModalOpen && (
          <Modal
            open={addModalOpen}
            aria-labelledby="copy-modal-title"
            aria-describedby="copy-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <div className="text-center">
                <h2
                  id="copy-modal-title"
                  className="text-xl font-semibold mb-4"
                >
                  ยืนยันการคัดลอกหนังสือ
                </h2>
                <p id="copy-modal-description" className="text-gray-600 mb-6">
                  คุณต้องการคัดลอกหนังสือ "{copyBook?.title}" เป็น Booktree
                  หรือไม่?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setAddModalOpen(false);
                      setCopyBook(null);
                    }}
                    disabled={isCopying}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleConfirmCopy}
                    disabled={isCopying}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isCopying ? "กำลังคัดลอก..." : "ยืนยัน"}
                  </button>
                </div>
              </div>
            </Box>
          </Modal>
        )}
      </Box>
    </>
  );
};

export default ManageBooks;
