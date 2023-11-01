import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast";
import {
  Modal,
  Box,
  FormControl,
  Input,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import LoadingScreen from "../../Loading/LoadingScreen";
import MyModal from "../../MyModal";
import ManualForm from "../Books/ManualForm";
import { Field, Formik } from "formik";
import { Form } from "react-router-dom";
import SupplierSelect from "../Books/SupplierSelect";
import { BookContext } from "../Books/Book";

const SellBooks = () => {
  const localSellCart = localStorage.getItem("sellCart");
  const [cart, setCart] = useState([]);
  const [member, setMember] = useState("none");
  const [memberId, setMemberId] = useState("");
  const [payment, setPayment] = useState("");
  const [cash, setCash] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [slip, setSlip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [addStockModal, setAddStockModal] = useState(false);

  // const [open, setOpen] = useState(false);

  const btnRef = useRef();
  const addToCartRef = useRef();

  useEffect(() => {
    if (localSellCart) {
      const localCartData = JSON.parse(localSellCart);
      if (memberId) {
        setCart(localCartData);
      } else {
        const newData = localCartData.map((item) => {
          return { ...item, discount: 0 };
        });
        setCart(newData);
      }
    }
  }, [localSellCart]);

  const setCartFunc = (data) => {
    setCart(data);
    localStorage.setItem("sellCart", JSON.stringify(data));
  };

  const handleChange = (ISBN, amount) => {
    const newArray = cart.map((book) => {
      if (book.ISBN === ISBN) {
        return { ...book, quantity: amount };
      }
      return book;
    });
    setCartFunc(newArray);
  };

  const handleAddCart = async (e) => {
    e.preventDefault();
    setLoading(true);
    const addBookFunc = async () => {
      if (!e.target.ISBN.value) return;
      const ISBN = e.target.ISBN.value.trim();
      if (!/^\d+$/.test(ISBN)) return toast.error("ไม่มีสินค้า " + ISBN);

      const existingItemIndex = cart.findIndex((book) => book.ISBN === ISBN);

      if (existingItemIndex !== -1) {
        const updatedArray = cart.map((book, index) => {
          if (index === existingItemIndex) {
            return {
              ...book,
              // discount:
              //   memberId && member == true
              //     ? bookData.author
              //       ? Math.ceil(bookData.price * 0.05)
              //       : 0
              //     : 0,
              // price:
              //   memberId && member == true
              //     ? bookData.author
              //       ? Math.floor(bookData.price)
              //       : bookData.price
              //     : bookData.price,
              quantity: book.quantity ? parseInt(book.quantity) + 1 : 1,
            };
          } else {
            return book;
          }
        });

        setCartFunc(updatedArray);
        return (document.getElementById("ISBN").value = "");
      }

      const res = await axios
        .get(import.meta.env.VITE_API_BASEURL + "/book/ISBN/" + ISBN)
        .catch((err) => console.log(err));

      let bookData =
        res?.data?.length > 0
          ? res.data[0].length > 0
            ? res.data[0][0]
            : res.data[1][0]
          : null;
      if (!bookData) {
        return setOpenModal(ISBN);
      }

      if (bookData.in_stock == 0) {
        // toast.error("สต็อกเป็น 0");
        return setAddStockModal(bookData);
      }

      const newData = [
        ...cart,
        {
          ...bookData,
          price: Math.floor(bookData.price),
          discount:
            memberId && member == true
              ? bookData.author
                ? Math.ceil(bookData.price * 0.05)
                : 0
              : 0,
          quantity: 1,
        },
      ];
      setCartFunc(newData);
      return (document.getElementById("ISBN").value = "");
    };
    await addBookFunc();
    setLoading(false);
  };

  const handleRemove = (ISBN) => {
    const newArray = cart.filter((book) => book.ISBN !== ISBN);
    setCartFunc(newArray);
  };

  const calcTotal = () => {
    let total = 0;
    cart.map((book) => {
      total += book.price * book.quantity;
    });
    return total.toFixed(2);
  };

  const calcDiscount = () => {
    let total = 0;
    cart.map((book) => {
      total += book.discount * book.quantity;
    });
    return total.toFixed(2);
  };
  const calcNetTotal = () => {
    return (calcTotal() - calcDiscount()).toFixed(2);
  };

  const checkMember = async (e) => {
    e.preventDefault();
    if (memberId) {
      setLoading(true);
      try {
        const res = await axios
          .get(import.meta.env.VITE_API_BASEURL + "/member/check/" + memberId)
          .catch((err) => console.log(err));
        if (res.data.status === "valid") {
          setMember(true);
          const newData = cart.map((book) => {
            if (book.author) {
              return {
                ...book,
                discount: Math.ceil(book.price * 0.05),
                price: Math.floor(book.price),
              };
            } else {
              return { ...book };
            }
          });
          setCartFunc(newData);
          toast.success("ส่วนลดสำเร็จ");
        } else {
          setMember(false);
          toast.error("หมายเลขสมาชิกนี้หมดอายุแล้ว");
        }
      } catch (err) {
        setMember(false);
        toast.error("ไม่มีหมายเลขสมาชิกนี้");
      } finally {
        setLoading(false);
      }
    }
  };

  const addOrderDetail = async (order_details) => {
    const res = await axios
      .post(
        import.meta.env.VITE_API_BASEURL + "/order/addorderdetail",
        order_details
      )
      .catch((err) => console.log(err));
  };

  const addOrder = async () => {
    try {
      const data = {
        customer_phone_number: phoneNumber,
        total: calcNetTotal(),
        payment: payment,
        receipt: slip,
        status: "completed",
      };

      const res = await axios.post(
        import.meta.env.VITE_API_BASEURL + "/order/addorder",
        data
      );

      const order_details = cart.map((book) => ({
        order_id: res.data.insertId,
        book_ISBN: book.ISBN,
        quantity: book.quantity,
        discount: book.discount * book.quantity,
      }));

      await addOrderDetail(order_details);
      toast.success("สำเร็จ");
      return { id: res.data.insertId, date: res.data.date };
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrint = async (order_num) => {
    const data = {
      items: cart,
      total: calcTotal(),
      discount: calcDiscount(),
      net: calcNetTotal(),
      payment: payment,
      orderNum: order_num,
    };

    await axios
      .post(import.meta.env.VITE_API_BASEURL + "/print", data)
      .catch((err) => console.log(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length == 0) return;
    if (!payment) {
      return toast.error("เลือกวิธีชำระเงิน");
    }
    if (payment == "cash" && !cash) {
      return toast.error("ใส่จำนวนเงิน");
    }

    let hasInvalidValue = false;

    cart.forEach((book) => {
      if (book.quantity > book.in_stock) {
        // toast.error("ไม่มี " + book.title + " ในสต็อก");
        toast.error(
          "มี " +
            book.title.substring(0, 15) +
            " แค่ " +
            book.in_stock +
            " ในสต็อก"
        );
        hasInvalidValue = true;
      }
    });

    try {
      if (!hasInvalidValue) {
        setConfirmLoading(true);
        setLoading(true);
        const { id, date } = await addOrder();
        const order_num = "INV" + String(id).padStart(5, "0");
        // const order_date = new Date(date).toString();
        await handlePrint(order_num);
        setCartFunc([]);
        setPayment("");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setConfirmLoading(false);
    }
  };

  // const handleAddSlip = (e) => {
  //   e.preventDefault();
  //   if (slip) {
  //     console.log(slip);
  //   }
  // };
  // const closeSlip = () => {
  //   setOpen(false);
  // };

  // const fileInputRef = useRef();

  // const style = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: 400,
  //   bgcolor: "background.paper",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  //   p: 4,
  // };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      btnRef.current.click();
    }
  };
  const printTest = async () => {
    const data = {
      items: cart,
      total: calcTotal(),
      discount: calcDiscount(),
      net: calcNetTotal(),
      payment: "cash",
      orderNum: "test123",
    };

    await axios
      .post(import.meta.env.VITE_API_BASEURL + "/print", data)
      .catch((err) => console.log(err));
  };

  return (
    <div className="mt-16">
      {loading && <LoadingScreen />}
      <form onSubmit={handleAddCart}>
        <div className="flex gap-5 justify-center w-[65%]">
          <input
            type="text"
            placeholder="ISBN"
            id="ISBN"
            name="ISBN"
            className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-2 py-1"
          />
          <button
            ref={addToCartRef}
            type="submit"
            className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs w-full sm:w-auto p-2 text-center"
          >
            เพิ่ม
          </button>
        </div>
      </form>
      <div className="flex gap-10 justify-around items-start">
        <form onSubmit={handleSubmit} className="mt-16 w-[65%]">
          <div>
            <table className="w-full">
              <thead>
                <tr className="flex gap-5 pb-4">
                  <th className="text-left w-[2.5%]">ที่</th>
                  <th className="text-left w-[20%]">ISBN</th>
                  <th className="text-left w-[32.5%]">ชื่อ</th>
                  <th className="text-center w-[10%]">ต่อหน่วย</th>
                  <th className="text-center w-[12.5%]">จำนวน</th>
                  <th className="text-center w-[10%]">ส่วนลด</th>
                  <th className="text-center w-[10%]">รวม</th>
                  <th className="text-center w-[2.5%]">ลบ</th>
                </tr>
              </thead>
              <tbody>
                {cart?.map((book, i) => (
                  <tr key={book.ISBN} className="flex gap-5 items-center pb-2">
                    <td className="w-[2.5%] text-left">{i + 1}</td>
                    <td className="w-[20%] text-left">{book.ISBN}</td>
                    <td className="w-[32.5%] text-left">
                      {book.title?.length > 30
                        ? book.title?.substring(0, 30) + "..."
                        : book.title}
                    </td>
                    <td className="w-[10%] text-center">
                      {book.price.toFixed(2)}
                    </td>
                    <td className="flex w-[12.5%] text-center items-center justify-around">
                      <input
                        className="w-14 h-[2rem] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        type="number"
                        min={1}
                        max={book.in_stock}
                        name="quantity"
                        value={book.quantity}
                        onChange={(e) => {
                          handleChange(book.ISBN, e.target.value);
                        }}
                      />
                      <p>/ {book.in_stock}</p>
                    </td>
                    <td className="w-[10%] text-center">
                      {(book.discount * book.quantity).toFixed(2)}
                    </td>
                    <td className="w-[10%] text-center">
                      {((book.price - book.discount) * book.quantity).toFixed(
                        2
                      )}
                    </td>
                    <td className="w-[2.5%] text-center">
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => handleRemove(book.ISBN)}
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center">
              <button ref={btnRef} hidden type="submit">
                ยืนยัน
              </button>
            </div>
          </div>
        </form>

        <div className="w-[25%]">
          <button className="border-red-500 border" onClick={printTest}>
            print test
          </button>
          <div>
            <p className="text-center text-xl mb-5">สรุปรายการขาย</p>
            <div className="border-4 px-4">
              <div className="border-b-4 py-4">
                <p className="flex justify-between mb-2">
                  <span>ทั้งหมด:</span>
                  <span className="ml-auto">{calcTotal()} บาท</span>
                </p>
                <p className="flex justify-between mb-2">
                  <span>ส่วนลด:</span>
                  <span className="ml-auto">
                    {member ? calcDiscount() : 0.0} บาท
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>ราคาสุทธิ:</span>
                  <span className="ml-auto">{calcNetTotal()} บาท</span>
                </p>
              </div>

              <div className="flex justify-evenly mb-2 py-4 border-b-4">
                <Input
                  type="text"
                  variant="outlined"
                  name="member_id"
                  placeholder="รหัสสมาชิก"
                  className="rounded-2xl px-2 py-1"
                  onChange={(e) => setMemberId(e.target.value)}
                  disabled={member == true}
                  value={memberId}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      checkMember(e);
                    }
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      {member === "none" ? (
                        <button
                          onClick={checkMember}
                          className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs w-full sm:w-auto p-2 text-center"
                        >
                          ยืนยัน
                        </button>
                      ) : (
                        <>
                          {member ? (
                            <CheckIcon sx={{ color: "green" }} />
                          ) : (
                            <button onClick={checkMember}>
                              <RefreshIcon sx={{ color: "blue" }} />
                            </button>
                          )}
                        </>
                      )}
                    </InputAdornment>
                  }
                />
              </div>
              <div className="flex justify-center py-2">
                <FormControl>
                  <InputLabel id="demo-simple-select-label">
                    ชำระเงินโดย
                  </InputLabel>
                  <Select
                    className="w-40"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Payment"
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                  >
                    <MenuItem value={"cash"}>เงินสด</MenuItem>
                    <MenuItem value={"transfer"}>QR code แสกน</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="border-b-4 px-4 pb-4 mb-4">
                {payment == "cash" && (
                  <div className="py-4 flex flex-col gap-8 items-stretch">
                    <p className="flex items-center justify-between">
                      <label>รับเงิน:</label>
                      <span>
                        <input
                          className="w-20 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          type="number"
                          name="amount"
                          onChange={(e) => setCash(e.target.value)}
                          onKeyDown={handleKeyPress}
                        />{" "}
                        บาท
                      </span>
                    </p>

                    <p className="flex items-center justify-between">
                      <span>เงินทอน:</span>
                      <span>
                        {cash && calcNetTotal() > 0
                          ? (cash - calcNetTotal()).toFixed(2)
                          : 0}{" "}
                        บาท
                      </span>
                    </p>
                  </div>
                )}
              </div>
              {payment && (
                <div>
                  {/* <div className="flex justify-between items-center">
                  <label>เบอร์โทร:</label>
                  <input
                    type="text"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div> */}
                  <div className="flex justify-center mt-4 pb-4">
                    <button
                      disabled={confirmLoading}
                      onClick={() => btnRef.current.click()}
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      {confirmLoading ? (
                        <CircularProgress
                          style={{
                            color: "white",
                          }}
                          size={20}
                        />
                      ) : (
                        <p>Confirm</p>
                      )}
                    </button>
                  </div>
                  {/* <Modal
                  open={open}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <div className="flex justify-end text-red-500">
                      <button onClick={closeSlip}>ไปต่อโดยไม่แนบสลิป</button>
                    </div>
                    <form className="text-center" onSubmit={handleAddSlip}>
                      <input
                        className="pt-4 mb-8"
                        type="file"
                        onChange={(e) => setSlip(e.target.files[0])}
                        ref={fileInputRef}
                        hidden
                      />
                      {slip ? (
                        <img
                          src={URL.createObjectURL(slip)}
                          className="object-cover h-full w-full cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            fileInputRef.current.click();
                          }}
                        />
                      ) : (
                        <button
                          className="flex my-6 justify-center items-center border-4 w-full aspect-square text-lg text-gray-500"
                          onClick={(e) => {
                            e.preventDefault();
                            if (e.nativeEvent.pointerId == -1) return;
                            fileInputRef.current.click();
                          }}
                        >
                          upload +
                        </button>
                      )}
                      <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                      >
                        Upload
                      </button>
                    </form>
                  </Box>
                </Modal> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <MyModal
          children={
            <AddBookModal
              onClose={() => setOpenModal(false)}
              initialISBN={openModal}
            />
          }
          onClose={() => setOpenModal(false)}
        />
      )}
      {addStockModal && (
        <MyModal
          children={
            <AddStockModal
              onClose={() => {
                setAddStockModal(false);
                addToCartRef.current.click();
              }}
              initial={addStockModal}
            />
          }
          onClose={() => setAddStockModal(false)}
        />
      )}
    </div>
  );
};

const AddBookModal = ({ onClose, initialISBN }) => {
  const [supplier, setSupplier1] = useState("");
  const { setSupplier } = useContext(BookContext);
  const [type, setType] = useState("book");
  const [next, setNext] = useState(false);
  const [ISBN, setISBN] = useState(initialISBN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const price = e.target.price.value;
    const quantity = e.target.quantity.value;
    if (!ISBN || !price || !quantity || !type || !supplier)
      return toast.error("ใส่ให้ครบถ้วน");

    const data = {
      ISBN,
      price,
      supplier_name: supplier.supplier_name,
    };

    await axios
      .post(
        import.meta.env.VITE_API_BASEURL +
          `/${type == "book" ? "book" : "stationery"}/add`,
        [data]
      )
      .catch((err) => {
        console.log(err);
      });

    const res = await axios.post(
      import.meta.env.VITE_API_BASEURL + "/stock/restock",
      { type: "add" }
    );
    const resId = res.data;

    const detailData = [
      {
        restock_id: resId,
        book_ISBN: ISBN,
        quantity: quantity,
      },
    ];

    await axios
      .post(
        import.meta.env.VITE_API_BASEURL + "/stock/restockDetail",
        detailData
      )
      .catch((err) => {
        console.log(err);
      });
    setSupplier("");
    toast.success("เพิ่มสำเร็จ");
    onClose();
  };

  return (
    <div className="py-5">
      {!next ? (
        <div className="h-24 flex flex-col justify-between">
          <div className="text-gray text-lg text-center mb-7">
            ไม่มีสินค้า คุณต้องการจะเพิ่มหรือไม่
          </div>
          <div className="flex gap-5 justify-around">
            <button
              type="button"
              onClick={() => onClose()}
              className="text-red-500 bg-white hover:bg-gray-200 font-medium rounded-lg px-5 py-2.5 text-center"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => setNext(true)}
              className="text-blue-600 bg-white hover:bg-gray-200 font-medium rounded-lg px-5 py-2.5 text-center"
            >
              เพิ่ม
            </button>
          </div>
        </div>
      ) : (
        <form action="submit" onSubmit={handleSubmit}>
          <div>
            <div className="flex justify-center items-center gap-3 mb-5 text-lg">
              <div className="">เพิ่มสินค้า</div>
              <select
                name="type"
                id="type"
                onChange={(e) => setType(e.target.value)}
              >
                <option value="book">หนังสือ</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            <div className="mb-5 flex gap-5 items-end">
              <div className="w-1/2">
                <label htmlFor="ISBN">ISBN</label>
                <input
                  value={ISBN}
                  onChange={(e) => setISBN(e.target.value)}
                  type="text"
                  name="ISBN"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="w-1/2">
                <SupplierSelect
                  product={type}
                  onChange={(sup) => setSupplier1(sup)}
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="mb-5 w-1/2">
                <label htmlFor="price">ราคา</label>
                <input
                  type="number"
                  name="price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-5 w-1/2">
                <label htmlFor="quantity">จำนวน</label>
                <input
                  type="number"
                  name="quantity"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center">
            <button
              type="submit"
              className="w-1/2 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Add
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
const AddStockModal = ({ onClose, initial }) => {
  const [next, setNext] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quantity = e.target.quantity.value;
    if (!quantity) return toast.error("ใส่ให้ครบถ้วน");

    const res = await axios.post(
      import.meta.env.VITE_API_BASEURL + "/stock/restock",
      { type: "add" }
    );
    const resId = res.data;

    const detailData = [
      {
        restock_id: resId,
        book_ISBN: initial.ISBN,
        quantity: quantity,
      },
    ];

    await axios
      .post(
        import.meta.env.VITE_API_BASEURL + "/stock/restockDetail",
        detailData
      )
      .catch((err) => {
        console.log(err);
      });
    toast.success("รับสต็อกสำเร็จ");
    onClose();
  };

  return (
    <div className="py-5">
      {!next ? (
        <div className="h-24 flex flex-col justify-between">
          <div className="text-gray text-lg text-center mb-7">
            สต็อกเป็น 0 คุณต้องการจะเพิ่มหรือไม่
          </div>
          <div className="flex gap-5 justify-around">
            <button
              type="button"
              onClick={() => onClose()}
              className="text-red-500 bg-white hover:bg-gray-200 font-medium rounded-lg px-5 py-2.5 text-center"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => setNext(true)}
              className="text-blue-600 bg-white hover:bg-gray-200 font-medium rounded-lg px-5 py-2.5 text-center"
            >
              เพิ่ม
            </button>
          </div>
        </div>
      ) : (
        <form action="submit" onSubmit={handleSubmit}>
          <div>
            <div className="mb-5 flex gap-5 items-end">
              <div className="w-1/2">
                <label htmlFor="ISBN">ISBN</label>
                <input
                  value={initial.ISBN}
                  type="text"
                  name="ISBN"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="supplier_name">Supplier</label>
                <input
                  value={initial.supplier_name}
                  type="text"
                  name="supplier_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="mb-5 w-1/2">
                <label htmlFor="price">ราคา</label>
                <input
                  value={initial.price}
                  type="number"
                  name="price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled
                />
              </div>
              <div className="mb-5 w-1/2">
                <label htmlFor="quantity">จำนวน</label>
                <input
                  type="number"
                  name="quantity"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center">
            <button
              type="submit"
              className="w-1/2 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Add
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SellBooks;
