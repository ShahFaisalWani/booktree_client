import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { useQuery } from "react-query";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function ExcelGenreSelect({ handleGenreChange, selectedGenre }) {
  const handleChange = (value) => {
    handleGenreChange(value);
  };

  const fetchGenres = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASEURL + "/book/genres"
    );
    return res.data;
  };

  const { isLoading, error, data } = useQuery(["genres"], fetchGenres);

  const genresList = data && data?.map((item) => item.genre_name);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        {genresList && (
          <Autocomplete
            id="combo-box-demo"
            value={selectedGenre}
            options={genresList}
            renderInput={(params) => <TextField {...params} label="หมวดหมู่" />}
            onChange={(event, value) => handleChange(value)}
          />
        )}
      </FormControl>
    </Box>
  );
}
