import React, { useContext, useEffect, useState } from "react";
import { Box, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { SortContext } from "../App";

const sortArray = [
  { label: "ค่าตั้งต้น", sort: "default", way: 0 },
  { label: "ราคา ตำ่-สูง", sort: "price", way: 0 },
  { label: "ราคา สูง-ตำ่", sort: "price", way: 1 },
  { label: "ชื่อหนังสือ", sort: "title", way: 0 },
  { label: "วันที่ขาย ใหม่-เก่า", sort: "added_on", way: 0 },
  { label: "วันที่ขาย เก่า-ใหม่", sort: "added_on", way: 1 },
];

const SortButton = () => {
  const { type, setType } = useContext(SortContext);

  const handleChange = (event) => {
    const selected = sortArray.find((item) => item.label == event.target.value);
    setType(selected);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">เรียงตาม</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type.label}
          label="sort"
          onChange={handleChange}
        >
          {sortArray?.map((sort) => (
            <MenuItem key={sort.label} value={sort.label}>
              {sort.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortButton;
