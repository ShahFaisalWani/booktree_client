import React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";

const thisYear = new Date().getFullYear();
const years = [thisYear - 3, thisYear - 2, thisYear - 1, thisYear];

const YearSelect = ({ year, handleYearChange }) => {
  const onChange = (e) => {
    handleYearChange(e.target.value);
  };
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label1">Year</InputLabel>
        <Select
          labelId="demo-simple-select-label1"
          id="demo-simple-select1"
          value={year}
          label="Month"
          onChange={onChange}
        >
          {years.map((i) => (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default YearSelect;
