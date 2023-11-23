import React, { useContext, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useQuery } from "react-query";
import Box from "@mui/material/Box";
import { BookContext } from "./Book";

export default function SupplierSelect({ initial, onChange, product }) {
  const { supplier, setSupplier } = useContext(BookContext);

  const fetchSuppliers = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASEURL + "/book/suppliers"
    );
    return res.data;
  };

  const { isLoading, error, data } = useQuery(["suppliers"], fetchSuppliers);

  useEffect(() => {
    if (initial) {
      console.log(data);
      const sup = data.filter((s) => s.supplier_name == initial);
      setSupplier(sup[0]);
    }
  }, [initial]);

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
  let newData = null;
  if (data) {
    if (product) {
      newData = data.filter((s) => s.product == product);
    } else {
      newData = data;
    }
    suppliersList = [allSup, ...newData];
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
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={supplier.supplier_name || ""}
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
