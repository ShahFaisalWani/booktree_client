import React, { useEffect, lazy, Suspense } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/Loading/LoadingScreen";
const LoginForm = lazy(() => import("../components/Auth/LoginForm"));

const LoginPage = () => {
  const token = Cookies.get("access-token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="flex items-center h-[calc(100vh-200px-2rem)] gap-10">
      <div className="w-1/2 h-full hidden sm:block">
        <img
          src="https://i0.wp.com/frenchglimpses.com/wp-content/uploads/2023/01/used-book-cafe.jpg?fit=922%2C1198&ssl=1"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-full m-auto px-5 sm:px-0 sm:w-1/2">
        <Suspense fallback={<LoadingScreen />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
};

export default LoginPage;
