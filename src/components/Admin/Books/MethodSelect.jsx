import React, { useContext } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { BookContext } from "./Book";

export default function MethodSelect() {
  const { method, setMethod } = useContext(BookContext);

  const handleChange = (event) => {
    setMethod(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Method</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={method}
          label="Method"
          onChange={handleChange}
        >
          <MenuItem value={"manual"}>Manual</MenuItem>
          <MenuItem value={"excel"}>Excel</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
