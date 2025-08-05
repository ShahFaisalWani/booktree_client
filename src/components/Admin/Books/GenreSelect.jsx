import React, { useEffect, useState } from "react";
import { FormControl, Box, Autocomplete, TextField } from "@mui/material";
import { useBookContext } from "../../../contexts/admin/BookContext";

export default function GenreSelect({
  initial,
  onChange,
  value = null,
  useLocalState = false,
}) {
  const { genres, genre, setGenre } = useBookContext();
  const [localValue, setLocalValue] = useState("");

  // Determine which value to use
  const currentValue = useLocalState
    ? localValue
    : value !== null
    ? value
    : genre;

  useEffect(() => {
    if (initial && genres?.length > 0) {
      const initialGenre = genres.find((g) => g.genre_name === initial);
      if (initialGenre) {
        const genreName = initialGenre.genre_name;
        if (useLocalState) {
          setLocalValue(genreName);
        } else {
          setGenre(genreName);
        }
        // Always call onChange to notify parent
        onChange?.(genreName);
      }
    }
  }, [initial, genres, setGenre, onChange, useLocalState]);

  // Update local value when external value changes (for controlled mode)
  useEffect(() => {
    if (useLocalState && value !== null && value !== localValue) {
      setLocalValue(value);
    }
  }, [value, useLocalState, localValue]);

  const handleGenreChange = (event, selectedValue) => {
    const newValue = selectedValue || "";
    if (useLocalState) {
      setLocalValue(newValue);
    } else {
      setGenre(newValue);
    }
    onChange?.(selectedValue);
  };

  const genresList = genres?.map((item) => item.genre_name) || [];

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          isOptionEqualToValue={(option, value) =>
            option === value || value === ""
          }
          options={genresList}
          value={currentValue || ""}
          renderInput={(params) => <TextField {...params} />}
          onChange={handleGenreChange}
        />
      </FormControl>
    </Box>
  );
}
