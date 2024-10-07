import React, { useContext, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { BookContext } from "./Book";

export default function SupplierSelect({ initial, onChange, product }) {
  const { suppliers, supplier, setSupplier } = useContext(BookContext);

  useEffect(() => {
    if (initial && suppliers?.length > 0) {
      const sup = suppliers.find((s) => s.supplier_name === initial);
      if (sup) {
        setSupplier(sup);
      }
    }
  }, [initial, suppliers, setSupplier]);

  const allSup = {
    supplier_name: "All",
    account: "-",
    accountant_email: "-",
    address: "-",
    bank: "-",
    full_name: "-",
    percent: 0,
    phone_number: "-",
    sales_email: "-",
    tax_number: "-",
    product: "all",
  };

  let suppliersList = null;
  if (suppliers) {
    suppliersList = product
      ? [allSup, ...suppliers.filter((s) => s.product === product)]
      : [allSup, ...suppliers];
  }

  const handleChange = (event) => {
    const selectedSup = event.target.value;
    const selectedSupplier = suppliersList.find(
      (supplier) => supplier.supplier_name === selectedSup
    );

    setSupplier(selectedSupplier);
    if (onChange) onChange(selectedSupplier);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
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
