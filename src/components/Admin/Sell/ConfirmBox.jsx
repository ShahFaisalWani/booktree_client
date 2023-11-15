import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useContext } from "react";
import { SellContext } from "./SellBooks";

const ConfirmBox = ({ handleSubmit }) => {
  const { cart, confirmLoading, payment, setPayment, cash, setCash } =
    useContext(SellContext);

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <>
      <div className="w-1/4 m-auto">
        <div className="border-2 p-4">
          <div className="flex justify-center py-2">
            <FormControl>
              <InputLabel id="demo-simple-select-label">ชำระเงินโดย</InputLabel>
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
                <p className="flex items-center justify-between text-green-600 text-xl font-bold">
                  <label>รับเงิน:</label>
                  <span>
                    <input
                      className="text-xl w-20 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      name="amount"
                      onChange={(e) => setCash(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />{" "}
                    บาท
                  </span>
                </p>

                <p className="flex items-center justify-between text-red-600 text-xl font-bold">
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
              <div className="flex justify-center mt-4 pb-4">
                <button
                  disabled={confirmLoading}
                  onClick={handleSubmit}
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfirmBox;
{
  /* <div className="flex justify-between items-center">
                  <label>เบอร์โทร:</label>
                  <input
                    type="text"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div> */
}

{
  /* <Modal
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
                </Modal> */
}
