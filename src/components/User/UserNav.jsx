import React from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/userSlice";
import Cookies from "js-cookie";

const UserLinks = [
  {
    label: "ข้อมูลส่วนตัว",
    path: "/profile",
    icon: <PermContactCalendarIcon />,
  },
  { label: "ประวัติการซื้อ", path: "/history", icon: <ManageSearchIcon /> },
  { label: "สมาชิก", path: "/member", icon: <CardMembershipIcon /> },
  { label: "Logout", path: "/logout", icon: <LogoutIcon /> },
];

const UserNav = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

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

  const handleClick = async (path) => {
    if (path !== "/logout") {
      navigateTo("/user" + path);
    } else {
      await axiosLogout();
    }
  };

  return (
    <div className="w-96">
      <List>
        {UserLinks.map((link, index) => (
          <ListItem key={index} disablePadding>
            <div
              className={`mb-8 w-full rounded-full ${
                location.pathname === "/user" + link.path
                  ? "bg-blue-500"
                  : "bg-gray-200"
              }`}
            >
              <ListItemButton
                sx={{ borderRadius: "100px" }}
                onClick={() => handleClick(link.path)}
              >
                <ListItemIcon
                  sx={{
                    color:
                      link.path === "/logout"
                        ? "red"
                        : location.pathname === "/user" + link.path
                        ? "white"
                        : "black",
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color:
                      link.path === "/logout"
                        ? "red"
                        : location.pathname === "/user" + link.path
                        ? "white"
                        : "black",
                  }}
                  primary={link.label}
                />
              </ListItemButton>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default UserNav;
