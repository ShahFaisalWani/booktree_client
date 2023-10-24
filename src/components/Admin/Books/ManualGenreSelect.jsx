import React, { useContext } from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { useQuery } from "react-query";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { BookContext } from "./Book";

export default function ManualGenreSelect() {
  const { genre, setGenre } = useContext(BookContext);

  const handleChange = (value) => {
    setGenre(value);
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
            disablePortal
            id="combo-box-demo"
            options={genresList}
            renderInput={(params) => <TextField {...params} label="หมวดหมู่" />}
            onChange={(event, value) => handleChange(value)}
          />
        )}
      </FormControl>
    </Box>
  );
}
