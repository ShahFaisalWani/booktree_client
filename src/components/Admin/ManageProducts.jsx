import React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import ManageBooks from "./Books/ManageBooks";
import ManageStationeries from "./Stationery/ManageStationeries";
import SupplierSelect from "./Books/SupplierSelect";
import { useBookContext } from "../../contexts/admin/BookContext";

const ManageProducts = () => {
  const { item, setItem, resetSupplierState } = useBookContext();

  const onChange = (e) => {
    const newItem = e.target.value;

    // Reset supplier when changing item type
    resetSupplierState();
    setItem(newItem);
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
      {item === "book" ? <ManageBooks /> : <ManageStationeries />}
    </div>
  );
};

export default ManageProducts;
