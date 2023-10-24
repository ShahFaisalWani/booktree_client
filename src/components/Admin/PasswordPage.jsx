import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const PasswordPage = () => {
  const [pass, setPass] = useState("");
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pass) {
      setLoading(true);
      axios
        .post(
          import.meta.env.VITE_API_BASEURL + "/admin/login",
          {
            password: pass,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data == "OK") {
            navigateTo("/admin/sellbooks");
          }
        })
        .catch((err) => {
          if (err.response?.status == 401) toast.error("รหัสผ่านไม่ถูกต้อง");
          else console.log("Error: ", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="flex items-center h-[calc(100vh-8rem)] gap-10">
      <div className="w-1/2 h-full">
        <img
          src="https://i0.wp.com/frenchglimpses.com/wp-content/uploads/2023/01/used-book-cafe.jpg?fit=922%2C1198&ssl=1"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-1/2">
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-8 flex flex-col gap-3">
            <h1>ยินดีต้อนรับสู่ Booktree Admin</h1>
            <p className="text-gray-700">โปรดใส่รหัสผ่านของแอดมิน</p>
          </div>
          <input
            onChange={(e) => setPass(e.target.value)}
            type="password"
            className="mb-8 py-3 px-4 block w-full rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
          />
          <div className="flex justify-center mt-4 pb-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {loading ? (
                <CircularProgress
                  style={{
                    color: "white",
                  }}
                  size={30}
                />
              ) : (
                <p className="flex items-center justify-center py-1 mr-1 text-base font-semibold text-white ">
                  เข้าสู่ระบบ
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </p>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordPage;
