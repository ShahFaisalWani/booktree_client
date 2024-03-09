import axios from "axios";
import React, { useRef, useState } from "react";
import LoadingScreen from "../../Loading/LoadingScreen";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Checkbox } from "@mui/material";
import MyModal from "../../MyModal";
import toast from "react-hot-toast";

const CompareStock = () => {
  const btnRef = useRef();
  const inputRef = useRef();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [persistedSelection, setPersistedSelection] = useState([]);
  const [refNum, setRefNum] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBooks([]);
    const formData = new FormData();
    formData.append("excel_file", e.target.upload.files[0]);

    const res = await axios
      .post(import.meta.env.VITE_API_BASEURL + "/book/excel", formData)
      .catch(() => {
        toast.error("File Error");
        setLoading(false);
      });
    if (!res) return (inputRef.current.value = "");

    const excelData = JSON.parse(res.data);
    excelData.map((row) => (row.in_stock = row.quantity));

    await axios
      .post(import.meta.env.VITE_API_BASEURL + "/stock/compareStock", excelData)
      .then((res) => {
        const newBooks = res.data.map((row, i) => {
          return { ...row, id: i };
        });
        setBooks(newBooks);
      })
      .catch((err) => {
        if (err.response.data?.kind === "none") toast.error("ไม่พบหนังสือ");
      });

    setLoading(false);
  };

  const clickRestock = () => {
    setOpenModal(true);
  };

  const handleRestock = async () => {
    setLoading(true);
    const res = await axios.post(
      import.meta.env.VITE_API_BASEURL + "/stock/restock",
      { type: "restock", refId: refNum }
    );

    const resId = res.data;

    const data = persistedSelection.map((book) => {
      const dif = book.actual_stock - book.in_stock;
      const type = dif > 0 ? "add" : "return";
      return {
        ...book,
        type,
        book_ISBN: book.ISBN,
        restock_id: resId,
        quantity: Math.abs(dif),
      };
    });

    await axios
      .post(import.meta.env.VITE_API_BASEURL + "/stock/restockDetail", data)
      .then(() => {
        toast.success("สำเร็จ");
        setPersistedSelection([]);
        if (inputRef.current) inputRef.current.value = "";
        setBooks([]);
        setOpenModal(false);
      })
      .catch((err) => {
        toast.error("Error");
        console.log(err);
      });
    setLoading(false);
  };

  const isSelected = (rowId) => {
    return persistedSelection.some((item) => item.id === rowId);
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
      width: 75,
      headerAlign: "center",
      renderCell: (params) => {
        const dif = params.row.actual_stock - params.row.in_stock;
        if (dif != 0) {
          return (
            <div className="m-auto">
              <Checkbox
                checked={isSelected(params.id)}
                onChange={(e) => {
                  handleCustomSelection(e, params.row);
                }}
              />
            </div>
          );
        }
      },
    },
    { field: "ISBN", headerName: "ISBN", width: 150 },
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
      headerName: "ชื่อเรื่อง",
      minWidth: 250,
    },
    { field: "genre", headerName: "หมวดหมู่", width: 150 },
    // {
    //   field: "supplier_name",
    //   headerName: "ตัวแทนจำหน่าย",
    //   minWidth: 150,
    // },
    {
      field: "price",
      headerName: "ราคา (฿)",
      sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
    },
    {
      field: "in_stock",
      headerName: "สต็อกปัจจุบัน",
      align: "center",
    },
    {
      field: "actual_stock",
      headerName: "สต็อกตามจริง",
      align: "center",
    },
  ];

  return (
    <div>
      {loading && <LoadingScreen />}
      <div className="flex mb-10 w-[70%] m-auto justify-between items-center">
        <form action="submit" onSubmit={handleSubmit}>
          <input
            type="file"
            name="upload"
            id="upload"
            ref={inputRef}
            onChange={() => btnRef.current.click()}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <div>
            <button ref={btnRef} type="submit" hidden />
          </div>
        </form>
        <div className="flex items-center gap-6">
          <input
            name="refNum"
            className="border border-gray-500 placeholder-gray-400 p-2 py-1"
            placeholder="เลขที่อ้างอิง"
            value={refNum}
            onChange={(e) => setRefNum(e.target.value)}
          />
          <button
            className={`w-full flex justify-center items-center text-white ${
              persistedSelection.length == 0
                ? "bg-gray-400"
                : "bg-blue-700 hover:bg-blue-800"
            } rounded-lg px-5 py-2.5 text-center`}
            onClick={clickRestock}
            disabled={persistedSelection.length == 0}
          >
            ปรับสต็อก
          </button>
        </div>
      </div>

      <div className="">
        {books && (
          <Box sx={{ maxHeight: "90vh", width: "70%", margin: "auto" }}>
            <DataGrid
              disableColumnFilter
              disableDensitySelector
              rows={books}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 15,
                  },
                },
              }}
              pageSizeOptions={[15]}
            />
          </Box>
        )}
      </div>
      {openModal && (
        <MyModal
          onClose={() => setOpenModal(false)}
          children={
            <div>
              <h3 className="mb-3">ยืนยันการปรับสต็อก</h3>
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="flex gap-5 pb-4">
                      <th className="text-left w-1/4">ISBN</th>
                      <th className="text-left w-1/2">ชื่อ</th>
                      <th className="text-center w-1/4">เดิม → ใหม่</th>
                    </tr>
                  </thead>
                  <tbody className="block max-h-[500px] overflow-y-scroll">
                    {persistedSelection?.map((stock) => (
                      <tr
                        key={stock.ISBN}
                        className="flex gap-5 items-center pb-2"
                      >
                        <td className="w-1/4 text-left">{stock.ISBN}</td>
                        <td className="w-1/2 text-left">{stock.title}</td>
                        <td className="w-1/4 text-center">
                          {stock.in_stock} → {stock.actual_stock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-6 pt-4 justify-center">
                <button
                  type="button"
                  className="text-red-500 bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
                  onClick={() => setOpenModal(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
                  onClick={handleRestock}
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default CompareStock;
