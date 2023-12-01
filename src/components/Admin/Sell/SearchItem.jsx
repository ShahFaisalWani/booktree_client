import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import debounce from "lodash/debounce";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { SellContext } from "./SellBooks";
import axios from "axios";

const SearchItem = () => {
  const { setSelectedSearch } = useContext(SellContext);

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  // Function to fetch data, debounced
  const fetchOptions = debounce((inputValue) => {
    if (!inputValue) {
      setOptions([]);
      return;
    }

    axios
      .get(
        import.meta.env.VITE_API_BASEURL +
          `/book/searchbytitle?title=${inputValue}`
      )
      .then((res) => {
        setOptions(res.data);
      })
      .catch((error) => {
        setOptions([]);
      });
  }, 500);

  useEffect(() => {
    fetchOptions(inputValue);
    // Cleanup the debounce function on component unmount
    return () => {
      fetchOptions.cancel();
    };
  }, [inputValue]);

  const clearInput = () => {
    setInputValue("");
    setSelected(null);
  };

  useEffect(() => {
    if (selected) {
      setSelectedSearch(selected);
      setTimeout(() => {
        clearInput();
      }, 10);
    }
  }, [selected]);

  return (
    <Autocomplete
      disablePortal
      options={options}
      sx={{ width: 350 }}
      getOptionLabel={(option) => option.title || ""}
      onChange={(event, newValue) => {
        setSelected(newValue);
      }}
      value={selected}
      renderOption={(props, option) => (
        <li {...props}>
          <div className="w-[80%]">{option.title}</div>
          <div className="w-[20%] text-right">{option.price}</div>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="ค้นหาชื่อ"
          onChange={(event) => setInputValue(event.target.value)}
        />
      )}
    />
  );
};

export default SearchItem;
