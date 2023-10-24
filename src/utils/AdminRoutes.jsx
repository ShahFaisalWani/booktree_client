import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/Loading/LoadingScreen";
import PasswordPage from "../components/Admin/PasswordPage";

const AdminRoutes = () => {
  const adminToken = Cookies.get("admin-token");
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!adminToken) {
        setDecodedToken({ isAdmin: false });
        return;
      }

      try {
        const response = await axios.get(
          import.meta.env.VITE_API_BASEURL + "/admin/verify",
          {
            withCredentials: true,
          }
        );
        setDecodedToken(response.data);
      } catch (error) {
        setDecodedToken({ isAdmin: false });
      }
    };
    verifyToken();
  }, [adminToken]);

  if (!decodedToken) return <LoadingScreen />;
  if (!decodedToken?.isAdmin) return <PasswordPage />;

  return <Outlet />;
};

export default AdminRoutes;
