import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import debounce from "lodash/debounce";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { SellContext } from "./SellBooks";
import axios from "axios";
import { calculateFinalPrice, validateDiscount } from "../../../utils/pricing";

const SearchItem = () => {
  const { setSelectedSearch } = useContext(SellContext);

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  const fetchOptions = debounce((inputValue, sortOrder) => {
    if (!inputValue) {
      setOptions([]);
      return;
    }

    setLoading(true);

    axios
      .get(
        import.meta.env.VITE_API_BASEURL +
          `/book/searchbytitle?title=${inputValue}&sort=${sortOrder}`
      )
      .then((res) => {
        setOptions(res.data);
      })
      .catch((error) => {
        setOptions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, 500);

  useEffect(() => {
    fetchOptions(inputValue, sortOrder);
    return () => {
      fetchOptions.cancel();
    };
  }, [inputValue, sortOrder]);

  const clearInput = () => {
    setInputValue("");
    setSelected(null);
  };

  const handleSortChange = () => {
    if (!loading) {
      const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newSortOrder);
    }
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
    <div>
      <Autocomplete
        disablePortal
        options={options}
        sx={{ width: 450 }}
        getOptionLabel={(option) => option.title || ""}
        onChange={(event, newValue) => {
          setSelected(newValue);
        }}
        value={selected}
        renderOption={(props, option) => {
          const finalPrice = calculateFinalPrice(option);
          const isDiscountValid = validateDiscount(
            option.publisher_discount,
            option.discount_start,
            option.discount_end
          );

          return (
            <li {...props} className="flex justify-between items-center px-2">
              <div className="max-w-[70%]">{option.title}</div>
              <div className="flex gap-1 whitespace-nowrap">
                {isDiscountValid > 0 ? (
                  <>
                    <span className="line-through text-gray-500">
                      {option.price}
                    </span>{" "}
                    <span className="text-red-500">{finalPrice} บาท</span>
                  </>
                ) : (
                  <span>{option.price} บาท</span>
                )}
              </div>
            </li>
          );
        }}
        renderInput={(params) => (
          <div className="flex">
            <TextField
              {...params}
              label="ค้นหาชื่อ"
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button
              onClick={handleSortChange}
              className="w-28 text-sm bg-blue-500 text-white p-2 rounded-lg mx-1"
              disabled={loading}
            >
              {loading
                ? "..."
                : sortOrder === "asc"
                ? "น้อยไปมาก"
                : "มากไปน้อย"}
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default SearchItem;
