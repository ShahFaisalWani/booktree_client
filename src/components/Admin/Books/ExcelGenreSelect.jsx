import React from "react";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useBookContext } from "../../../contexts/admin/BookContext";

export default function ExcelGenreSelect({ handleGenreChange, selectedGenre }) {
  const { genres } = useBookContext();

  const handleChange = (value) => {
    handleGenreChange(value);
  };

  const genresList = genres && genres?.map((item) => item.genre_name);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        {genresList && (
          <Autocomplete
            value={selectedGenre}
            options={genresList}
            renderInput={(params) => <TextField {...params} />}
            onChange={(event, value) => handleChange(value)}
          />
        )}
      </FormControl>
    </Box>
  );
}
