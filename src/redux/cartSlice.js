import { createSlice, createSelector } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { validateDiscount } from "../utils/pricing";

const member = sessionStorage.getItem("isMember");
const isMember = member && JSON.parse(member);

const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) {
      return undefined;
    }
    const cartItems = JSON.parse(serializedState);

    const updatedData = Object.fromEntries(
      Object.entries(cartItems.items).map(([key, value]) => {
        const validatedDiscount = validateDiscount(
          value.publisher_discount,
          value.discount_start,
          value.discount_end
        );
        const publisherDiscount = value.price * (validatedDiscount / 100);

        const memberDiscount =
          !publisherDiscount && isMember && value.author
            ? value.price * 0.05
            : 0;

        const finalDiscount = Math.round(publisherDiscount || memberDiscount); // Round up discount

        return [key, { ...value, discount: finalDiscount }];
      })
    );
    return { items: updatedData };
  } catch (err) {
    return undefined;
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartState() || {
    items: {},
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      if (newItem.price) newItem.price = parseFloat(newItem.price);
      if (newItem.quantity) newItem.quantity = parseInt(newItem.quantity);

      const existingItem = state.items[newItem.ISBN];

      const validatedDiscount = validateDiscount(
        newItem.publisher_discount,
        newItem.discount_start,
        newItem.discount_end
      );
      const publisherDiscount = newItem.price * (validatedDiscount / 100);

      const memberDiscount =
        !publisherDiscount && isMember && newItem.author
          ? newItem.price * 0.05
          : 0;

      const finalDiscount = Math.round(publisherDiscount || memberDiscount); // Round up discount

      if (existingItem) {
        if (
          newItem.type === "single" &&
          existingItem.quantity < existingItem.in_stock
        ) {
          toast.success("เพิ่มลงตะกร้าเรียบร้อย");
          existingItem.quantity += 1;
        } else if (
          newItem.type === "single" &&
          existingItem.quantity == existingItem.in_stock
        ) {
          toast.error("Out of stock");
        } else {
          if (
            existingItem.quantity + newItem.quantity <=
            existingItem.in_stock
          ) {
            toast.success("เพิ่มลงตะกร้าเรียบร้อย");
            existingItem.quantity += newItem.quantity;
          } else {
            toast.error("Out of stock");
          }
        }
      } else {
        if (newItem.in_stock == 0) {
          toast.error("Out of stock");
        } else {
          state.items[newItem.ISBN] = {
            ...newItem,
            quantity: newItem.quantity || 1,
            discount: finalDiscount,
          };
          toast.success("เพิ่มลงตะกร้าเรียบร้อย");
        }
      }
      saveCartState(state);
    },
    removeItem: (state, action) => {
      const item = state.items[action.payload.ISBN];
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        delete state.items[action.payload.ISBN];
      }
      saveCartState(state);
    },
    popItem: (state, action) => {
      delete state.items[action.payload.ISBN];
      saveCartState(state);
    },
    applyDiscount: (state) => {
      Object.values(state.items).forEach((item) => {
        const validatedDiscount = validateDiscount(
          item.publisher_discount,
          item.discount_start,
          item.discount_end
        );
        const publisherDiscount = item.price * (validatedDiscount / 100);

        const memberDiscount =
          !publisherDiscount && item.author ? item.price * 0.05 : 0;

        const finalDiscount = Math.round(publisherDiscount || memberDiscount); // Round up discount

        item.discount = finalDiscount;
      });
      saveCartState(state);
    },
    clearCart: (state) => {
      state.items = {};
      saveCartState(state);
    },
  },
});

export const { addItem, removeItem, popItem, applyDiscount, clearCart } =
  cartSlice.actions;

export const getTotalItems = createSelector(
  (state) => state.cart.items,
  (items) => {
    let totalItems = 0;
    Object.values(items).forEach((item) => {
      totalItems += item.quantity;
    });
    return totalItems;
  }
);

export const getTotalPrice = createSelector(
  (state) => state.cart.items,
  (items) => {
    let totalPrice = 0;
    Object.values(items).forEach((item) => {
      const discountedPrice = item.price;
      totalPrice += item.quantity * discountedPrice;
    });
    return totalPrice;
  }
);

export const getTotalDiscount = createSelector(
  (state) => state.cart.items,
  (items) => {
    let totalDiscount = 0;
    Object.values(items).forEach((item) => {
      totalDiscount += item.discount * item.quantity;
    });
    return totalDiscount;
  }
);

export default cartSlice.reducer;
