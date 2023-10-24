import { createSlice, createSelector } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const member = sessionStorage.getItem("isMember");
const isMember = member && JSON.parse(member);

const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) {
      return undefined;
    }
    const cartItems = JSON.parse(serializedState);
    if (!isMember) {
      const updatedData = Object.fromEntries(
        Object.entries(cartItems.items).map(([key, value]) => [
          key,
          { ...value, discount: 0 },
        ])
      );
      return { items: updatedData };
    }
    return cartItems;
  } catch (err) {
    return undefined;
  }
};

const saveCartState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cart", serializedState);
  } catch (err) {
    console.log(err);
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
        // if (isMember && newItem.author) {
        //   state.items[newItem.ISBN] = {
        //     ...newItem,
        //     quantity: newItem.quantity || 1,
        //     discount: newItem.price * 0.05,
        //   };
        // } else {
        //   state.items[newItem.ISBN] = {
        //     ...newItem,
        //     quantity: newItem.quantity || 1,
        //     discount: 0,
        //   };
        // }
        if (newItem.in_stock == 0) {
          toast.error("Out of stock");
        } else if (isMember) {
          state.items[newItem.ISBN] = {
            ...newItem,
            quantity: newItem.quantity || 1,
            discount: newItem.price * 0.05,
          };
          toast.success("เพิ่มลงตะกร้าเรียบร้อย");
        } else {
          state.items[newItem.ISBN] = {
            ...newItem,
            quantity: newItem.quantity || 1,
            discount: 0,
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
        if (item.author) item.discount = item.price * 0.05;
      });
      saveCartState(state);
    },
    clearCart: (state) => {
      state.items = {};
      saveCartState(state);
    },
  },
});

export const {
  addItem,
  removeItem,
  popItem,
  applyDiscount,
  removeDiscount,
  clearCart,
} = cartSlice.actions;

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
      totalPrice += item.quantity * item.price;
    });
    return totalPrice;
  }
);

export const getTotalDiscount = createSelector(
  (state) => state.cart.items,
  (items) => {
    if (!isMember) return 0;
    let totalDiscount = 0;
    Object.values(items).forEach((item) => {
      totalDiscount += item.discount * item.quantity;
    });
    return totalDiscount;
  }
);

export default cartSlice.reducer;
