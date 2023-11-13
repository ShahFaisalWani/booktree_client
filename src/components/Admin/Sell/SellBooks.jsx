import axios from "axios";
import { useEffect, useRef, useState, createContext } from "react";
import { toast } from "react-hot-toast";
import LoadingScreen from "../../Loading/LoadingScreen";
import MemberInput from "./MemberInput";
import CartList from "./CartList";
import ConfirmBox from "./ConfirmBox";
import SearchItem from "./SearchItem";

export const SellContext = createContext();

const SellBooks = () => {
  const localSellCart = localStorage.getItem("sellCart");
  const [cart, setCart] = useState([]);
  const [member, setMember] = useState("none");
  const [memberId, setMemberId] = useState("");
  const [payment, setPayment] = useState("cash");
  const [cash, setCash] = useState(0);
  const [slip, setSlip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState("");

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
        customer_phone_number: memberId,
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
        toast.error(
          "มี " +
            book.title?.substring(0, 15) +
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
        setMember(false);
        setMemberId("none");
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

  // const printTest = async () => {
  //   const data = {
  //     items: cart,
  //     total: calcTotal(),
  //     discount: calcDiscount(),
  //     net: calcNetTotal(),
  //     payment: "cash",
  //     orderNum: "test123",
  //   };

  //   await axios
  //     .post(import.meta.env.VITE_API_BASEURL + "/print", data)
  //     .catch((err) => console.log(err));
  // };

  return (
    <SellContext.Provider
      value={{
        cart,
        setCart,
        member,
        setMember,
        memberId,
        setMemberId,
        payment,
        setPayment,
        cash,
        setCash,
        confirmLoading,
        selectedSearch,
        setSelectedSearch,
      }}
    >
      {loading && <LoadingScreen />}
      <div className="mt-16">
        <div className="flex justify-between px-16">
          <div></div>
          <MemberInput />
          <SearchItem />
        </div>
        <div>
          <CartList />
        </div>
        <div className="mt-12">
          <ConfirmBox handleSubmit={handleSubmit} />
        </div>
      </div>
    </SellContext.Provider>
  );
};

export default SellBooks;
