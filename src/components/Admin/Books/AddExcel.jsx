import axios from "axios";
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import LoadingScreen from "../../Loading/LoadingScreen";
import toast from "react-hot-toast";

const AddExcel = forwardRef((props, ref) => {
  const { onChange } = props;
  const [loading, setLoading] = useState(false);
  const btnRef = useRef();
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    openFileInput() {
      inputRef.current.click();
    },
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("excel_file", e.target.upload.files[0]);

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_BASEURL + "/book/excel",
        formData
      );
      onChange(JSON.parse(res.data));
    } catch (err) {
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
      console.log(err);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <LoadingScreen />}
      <div className="">
        <form action="submit" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="file"
            name="upload"
            id="upload"
            onChange={() => btnRef.current.click()}
            hidden
          />
          <div>
            <button ref={btnRef} type="submit" hidden>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default AddExcel;
