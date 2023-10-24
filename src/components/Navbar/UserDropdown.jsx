import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/userSlice";
import Cookies from "js-cookie";

const UserLinks = [
  { label: "ข้อมูลส่วนตัว", path: "/profile" },
  { label: "ประวัติการซื้อ", path: "/history" },
  { label: "สมาชิก", path: "/member" },
  { label: "Logout", path: "/logout" },
];

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const axiosLogout = async () => {
    await axios
      .get(import.meta.env.VITE_API_BASEURL + "/customer/logout", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data == "OK") {
          Cookies.set("access-token", "", {
            secure: false,
            httpOnly: false,
            sameSite: "strict",
            path: "/",
            domain: "booktree.site",
          });
          dispatch(clearUser());
          navigateTo("/");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSelect = async (link) => {
    setAnchorEl(null);
    if (link.path === "/logout") await axiosLogout();
    else navigateTo("/user" + link.path);
  };

  return (
    <div className="Dropdown">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleProfileClick}
        sx={{ color: "black" }}
      >
        <PersonIcon sx={{ fontSize: "2.1em" }} />
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {UserLinks?.map((link) => (
          <div
            key={link.label}
            className={link.path == "/logout" ? "text-red-500" : ""}
          >
            <MenuItem
              value={link.path}
              onClick={() => {
                handleClose;
                handleSelect(link);
              }}
            >
              {link.label}
            </MenuItem>
          </div>
        ))}
      </Menu>
    </div>
  );
};

export default UserDropdown;
