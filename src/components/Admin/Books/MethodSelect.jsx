import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { useBookContext } from "../../../contexts/admin/BookContext";

export default function MethodSelect() {
  const { method, setMethod } = useBookContext();

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
