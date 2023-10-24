import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import ManageBooks from "./Books/ManageBooks";
import ManageStationeries from "./Stationery/ManageStationeries";
import SupplierSelect from "./Books/SupplierSelect";
import { BookContext } from "./Books/Book";

const ManageProducts = () => {
  const { setSupplier } = useContext(BookContext);
  const [item, setItem] = useState(() => {
    return localStorage.getItem("selectedItemType") || "book";
  });
  const onChange = (e) => {
    setSupplier("");
    setItem(e.target.value);
    localStorage.setItem("selectedItemType", e.target.value);
  };

  return (
    <div>
      <div className="flex mb-10 justify-around">
        <Box sx={{ width: "47%" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">สินค้า</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={item}
              label="Product"
              onChange={onChange}
            >
              <MenuItem value={"book"}>หนังสือ</MenuItem>
              <MenuItem value={"other"}>อื่นๆ</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: "47%" }}>
          <SupplierSelect product={item} />
        </Box>
      </div>
      {item == "book" ? <ManageBooks /> : <ManageStationeries />}
    </div>
  );
};

export default ManageProducts;
