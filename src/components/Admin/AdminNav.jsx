import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import Cookies from "js-cookie";
import { slide as Menu } from "react-burger-menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

var styles = {
  bmBurgerButton: {
    position: "fixed",
    width: "36px",
    height: "30px",
    left: "36px",
    top: "30px",
  },
  bmBurgerBars: {
    background: "#373a47",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "24px",
    width: "24px",
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
  },
  bmMenu: {
    background: "#373a47",
    paddingTop: "2.5em",
    fontSize: "1.25em",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#eeeeee",
  },
  bmItem: {
    display: "flex",
    flexDirection: "column",
    // gap: "20px",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
  },
};

const AdminLinks = [
  { label: "หน้าหลัก", path: "/" },
  { label: "ขายสินค้า", path: "/sellbooks" },
  { label: "เช็คสต็อก", path: "/checkstock" },
  { label: "ยอดขายรายวัน", path: "/dailyreport" },
  { label: "รายงานตามตัวแทนจำหน่าย", path: "/supplierreport" },
  { label: "รายงานสต็อก", path: "/stockreport" },
  { label: "จัดการสมาชิก", path: "/managemembers" },
  { label: "ข้อมูลตัวแทนจำหน่าย", path: "/managesuppliers" },
  { label: "จัดการสินค้า", path: "/manageproducts" },
  { label: "รายงานการจัดการสินค้า", path: "/restockreport" },
];

const AdminNav = () => {
  const [open, setOpen] = useState(false);
  const navigateTo = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (path) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleClick = (path) => {
    navigateTo("/admin" + path);
    setOpen(false);
  };

  const handleLogout = async () => {
    await axios
      .get(import.meta.env.VITE_API_BASEURL + "/admin/logout", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data == "OK") {
          Cookies.set("admin-token", "", {
            httpOnly: false,
            sameSite: "strict",
            path: "/",
            domain: "booktree.site",
          });
          navigateTo("/admin/logout");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="border-b-2 h-20 p-0 flex justify-between">
        <div>
          <Menu
            styles={styles}
            isOpen={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
          >
            <div>
              {AdminLinks.map((link) => (
                <div key={link.path} className="w-full">
                  <button
                    onClick={() => {
                      if (link.subMenu) {
                        toggleDropdown(link.path);
                      } else {
                        handleClick(link.path);
                      }
                    }}
                    className="w-full flex justify-between px-5 py-4 text-left pl-4 bg-[#383a47] hover:bg-[#2d2e39] items-center gap-3"
                  >
                    {link.label}
                    {link.icon}
                  </button>
                  {link.subMenu && dropdownOpen[link.path] && (
                    <div className="transition-all transform origin-top mt-2">
                      {link.subMenu.map((subLink) => (
                        <button
                          key={subLink.path}
                          onClick={() => handleClick(link.path + subLink.path)}
                          className="py-2 text-left pl-8 bg-[#383a47] hover:bg-[#2d2e39] block w-full text-sm"
                        >
                          {subLink.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Menu>
        </div>
        <div className="flex flex-col justify-center">
          <h1>Booktree Admin</h1>
        </div>
        <div className="flex flex-col justify-center">
          <Button onClick={handleLogout}>
            <LogoutIcon sx={{ fontSize: "35px", color: "red" }} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
