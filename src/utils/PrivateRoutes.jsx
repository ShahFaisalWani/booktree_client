import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { clearUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import LoadingScreen from "../components/Loading/LoadingScreen";

const PrivateRoutes = () => {
  const userToken = Cookies.get("access-token");
  const dispatch = useDispatch();
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!userToken) {
        setDecodedToken({ valid: false });
        return;
      }

      try {
        const response = await axios.get(
          import.meta.env.VITE_API_BASEURL + "/customer/verify",
          {
            withCredentials: true,
          }
        );
        setDecodedToken({ ...response.data, valid: true });
      } catch (error) {
        setDecodedToken({ valid: false });
        Cookies.set("access-token", "");
        dispatch(clearUser());
      }
    };
    verifyToken();
  }, [userToken]);

  if (!decodedToken) return <LoadingScreen />;
  if (!decodedToken?.valid) return <Navigate to="/login" />;

  return <Outlet />;
};

export default PrivateRoutes;
