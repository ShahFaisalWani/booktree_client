import React from "react";
import { useSelector } from "react-redux";
import { getTotalItems } from "../../redux/cartSlice";
import { Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

const CartBtn = () => {
  const totalItems = useSelector(getTotalItems);

  const navigateTo = useNavigate();

  return (
    <IconButton
      color="inherit"
      aria-label="Cart"
      onClick={() => navigateTo("/checkout")}
    >
      <Badge badgeContent={totalItems} color="error">
        <ShoppingCartIcon sx={{ fontSize: "1.2em" }} />
      </Badge>
    </IconButton>
  );
};

export default CartBtn;
