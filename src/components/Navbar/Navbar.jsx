import React, { lazy, Suspense, useEffect, useState } from "react";
import "../../styles/Navbar.scss";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import Searchbar from "./Searchbar";
import GenreDropdown from "./GenreDropdown";
const CartBtn = lazy(() => import("../Cart/CartBtn"));
const UserDropdown = lazy(() => import("./UserDropdown"));

import genres from "../../assets/genres.json";
import LoadingScreen from "../Loading/LoadingScreen";
import Cookies from "js-cookie";
import { clearUser } from "../../redux/userSlice";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const userToken = Cookies.get("access-token");
  const dispatch = useDispatch();
  const [decodedToken, setDecodedToken] = useState(null);
  const [open, setOpen] = useState(false);

  const genreList =
    window.innerWidth < 640
      ? [{ name: "หน้าหลัก", subGenres: [] }, ...genres]
      : genres;

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

  return (
    <div className="Navbar">
      <div className="top">
        <div className="logo w-[150px] hidden sm:block">
          <div className="absolute top-4 h-[130px] w-[200px]">
            <Link to="/">
              <img
                src="/logo1.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        </div>
        <div
          className="block sm:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </div>
        <div className="searchBar">
          <Searchbar />
        </div>
        <div className="login flex gap-1 sm:gap-10 items-center">
          <CartBtn />
          {decodedToken?.valid ? (
            <Suspense fallback={<LoadingScreen />}>
              <UserDropdown />
            </Suspense>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs sm:text-[15px] p-2 sm:p-3 w-full sm:w-auto text-center"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
      <div className="bottom">
        <div className={`dropdowns ${open ? "open" : "close"}`}>
          {genreList.map((genre) => (
            <GenreDropdown
              key={genre.name}
              genre={genre}
              closeNav={() => setOpen(false)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
