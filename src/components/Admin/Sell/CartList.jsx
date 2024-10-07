import React, { useContext, useEffect, useRef, useState } from "react";
import { SellContext } from "./SellBooks";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import MyModal from "../../MyModal";
import { BookContext } from "../Books/Book";
import SupplierSelect from "../Books/SupplierSelect";
import toast from "react-hot-toast";
import { calculateFinalPrice, validateDiscount } from "../../../utils/pricing";

const CartList = ({
  setCartFunc,
  calcQuantity,
  calcTotal,
  calcDiscount,
  calcNetTotal,
}) => {
  const { cart, setCart, member, memberId, selectedSearch, setSelectedSearch } =
    useContext(SellContext);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [addStockModal, setAddStockModal] = useState(false);

  const addToCartRef = useRef();

  const handleRemove = (ISBN) => {
    const newArray = cart.filter((book) => book.ISBN !== ISBN);
    setCartFunc(newArray);
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

  const addBookFunc = async (e) => {
    if (!e.target.ISBN.value) return;
    const ISBN = e.target.ISBN.value.trim();
    if (!/^\d+$/.test(ISBN)) return toast.error("ไม่มีสินค้า " + ISBN);

    const existingItemIndex = cart.findIndex((book) => book.ISBN === ISBN);

    if (existingItemIndex !== -1) {
      const updatedArray = cart.map((book, index) => {
        if (index === existingItemIndex) {
          return {
            ...book,
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
      return setAddStockModal(bookData);
    }

    const publisherDiscount = validateDiscount(
      bookData.publisher_discount,
      bookData.discount_start,
      bookData.discount_end
    );

    const finalPrice = calculateFinalPrice(bookData);

    const memberDiscount =
      memberId && member === true && publisherDiscount === 0
        ? finalPrice * 0.05
        : 0;

    const newData = [
      ...cart,
      {
        ...bookData,
        price: Math.floor(bookData.price),
        cart_discount: bookData.price - finalPrice + memberDiscount,
        quantity: 1,
      },
    ];

    setCartFunc(newData);
    return (document.getElementById("ISBN").value = "");
  };

  const handleAddCart = async (e) => {
    e.preventDefault();
    setLoading(true);

    await addBookFunc(e);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedSearch) {
      document.getElementById("ISBN").value = selectedSearch.ISBN;
      addToCartRef.current.click();
      setSelectedSearch(null);
    }
  }, [selectedSearch]);

  return (
    <>
      <div className="mt-16 px-16">
        <table className="w-full">
          <thead>
            <tr className="flex gap-5 pb-4">
              <th className="text-left w-[2.5%]">ที่</th>
              <th className="text-left w-[15%]">ISBN</th>
              <th className="text-left w-[30%]">ชื่อ</th>
              <th className="text-center w-[8.5%]">ต่อหน่วย</th>
              <th className="text-center w-[8.5%]">สต็อก</th>
              <th className="text-center w-[8.5%]">จำนวน</th>
              <th className="text-center w-[8.5%]">รวม</th>
              <th className="text-center w-[8.5%]">ส่วนลด</th>
              <th className="text-center w-[8.5%]">สุทธิ</th>
              <th className="text-center w-[2.5%]">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {cart?.map((book, i) => (
              <tr key={book.ISBN} className="flex gap-5 items-center pb-2">
                <td className="w-[2.5%] text-left">{i + 1}</td>
                <td className="w-[15%] text-left">{book.ISBN}</td>
                <td className="w-[30%] text-left">
                  {book.title?.length > 50
                    ? book.title?.substring(0, 50) + "..."
                    : book.title}
                </td>
                <td className="w-[8.5%] text-center">
                  {book.price.toFixed(2)}
                </td>
                <td className="w-[8.5%] text-center">{book.in_stock}</td>
                <td className="flex w-[8.5%] text-center items-center justify-around">
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
                </td>
                <td className="w-[8.5%] text-center">
                  {(book.price * book.quantity).toFixed(2)}
                </td>
                <td className="w-[8.5%] text-center">
                  {(book.cart_discount * book.quantity).toFixed(2)}
                </td>
                <td className="w-[8.5%] text-center">
                  {((book.price - book.cart_discount) * book.quantity).toFixed(
                    2
                  )}
                </td>
                <td className="w-[2.5%] text-center">
                  <DeleteIcon
                    sx={{ color: "red" }}
                    onClick={() => handleRemove(book.ISBN)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleAddCart} className="mt-2 px-16">
        <div className="flex gap-5 pb-4">
          <div className="text-left w-[2.5%]"></div>
          <div className="text-left w-[15%]">
            <input
              type="text"
              placeholder="ISBN"
              id="ISBN"
              name="ISBN"
              className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-2 py-1 max-w-[85%]"
            />
            <button ref={addToCartRef} type="submit" className="hidden">
              เพิ่ม
            </button>
          </div>
          <div className="text-left w-[30%]"></div>
          <div className="text-center w-[8.5%]"></div>
          <div className="text-center w-[8.5%]"></div>
          <div className="text-center w-[8.5%] text-2xl">{calcQuantity}</div>
          <div className="text-center w-[8.5%] text-2xl">{calcTotal}</div>
          <div className="text-center w-[8.5%] text-2xl">{calcDiscount}</div>
          <div className="text-center w-[8.5%] text-2xl bg-green-500 text-white">
            {calcNetTotal}
          </div>
          <div className="text-center w-[2.5%]"></div>
        </div>
      </form>
      {openModal && (
        <MyModal
          children={
            <AddBookModal
              onClose={() => setOpenModal(false)}
              initialISBN={openModal}
              onSuccess={() => {
                setOpenModal(false);
                addToCartRef.current.click();
              }}
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
              }}
              initial={addStockModal}
              onSuccess={() => {
                setAddStockModal(false);
                addToCartRef.current.click();
              }}
            />
          }
          onClose={() => setAddStockModal(false)}
        />
      )}
    </>
  );
};

const AddBookModal = ({ initialISBN, onSuccess, onClose }) => {
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
      ISBN: ISBN.trim(),
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
        book_ISBN: ISBN.trim(),
        quantity: quantity,
      },
    ];

    await axios
      .post(
        import.meta.env.VITE_API_BASEURL + "/stock/restockDetail",
        detailData
      )
      .then(() => {
        toast.success("เพิ่มสำเร็จ");
        setSupplier("");
        onSuccess();
      })
      .catch((err) => {
        console.log(err);
      });
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
                  min={1}
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
const AddStockModal = ({ initial, onSuccess, onClose }) => {
  const [next, setNext] = useState(false);
  const nextRef = useRef(null);

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
      .then(() => {
        toast.success("รับสต็อกสำเร็จ");
        onSuccess();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="py-5 ">
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
              ref={nextRef}
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
                  min={1}
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

export default CartList;
