import React, { useEffect, useContext, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { BookContext } from "./Books/Book";

export default function EditSupplierSelect({ initial, onChange, product }) {
  const { suppliers } = useContext(BookContext);
  const [supplier, setSupplier] = useState("");

  useEffect(() => {
    if (initial && suppliers?.length > 0) {
      const sup = suppliers.find((s) => s.supplier_name === initial);
      setSupplier(sup);
    }
  }, [initial, suppliers]);

  let suppliersList = null;
  if (suppliers) {
    suppliersList = product
      ? suppliers.filter((s) => s.product === product)
      : suppliers;
  }

  const handleChange = (event) => {
    const selectedSup = event.target.value;
    const selectedSupplier = suppliersList.find(
      (supplier) => supplier.supplier_name === selectedSup
    );

    setSupplier(selectedSupplier);
    onChange(selectedSupplier);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="supplier-select-label">Supplier</InputLabel>
        <Select
          labelId="supplier-select-label"
          id="supplier-select"
          value={supplier?.supplier_name || ""}
          label="Supplier"
          onChange={handleChange}
        >
          {suppliersList?.map((item, i) => (
            <MenuItem key={i} value={item.supplier_name}>
              {item.supplier_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
