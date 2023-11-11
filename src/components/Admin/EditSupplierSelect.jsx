import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useQuery } from "react-query";
import Box from "@mui/material/Box";

export default function EditSupplierSelect({ initial, onChange, product }) {
  const [supplier, setSupplier] = useState("");

  const fetchSuppliers = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASEURL + "/book/suppliers"
    );
    return res.data;
  };

  const { isLoading, error, data } = useQuery(["suppliers"], fetchSuppliers);

  useEffect(() => {
    if (initial) {
      const sup = data.filter((s) => s.supplier_name == initial);
      setSupplier(sup[0]);
    }
  }, [initial]);

  let suppliersList = null;
  let newData = null;
  if (data) {
    if (product) {
      newData = data.filter((s) => s.product == product);
    } else {
      newData = data;
    }
    suppliersList = [...newData];
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
        <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={supplier.supplier_name || ""}
          label="Age"
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
