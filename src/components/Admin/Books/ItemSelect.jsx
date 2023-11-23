import React, { useContext } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { BookContext } from "./Book";

export default function ItemSelect() {
  const { item, setItem } = useContext(BookContext);

  const handleChange = (event) => {
    setItem(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">ประเภทสินค้า</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={item}
          label="ประเภทสินค้า"
          onChange={handleChange}
        >
          <MenuItem value={"book"}>หนังสือ</MenuItem>
          <MenuItem value={"other"}>เครื่องเขียน / อื่นๆ</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
