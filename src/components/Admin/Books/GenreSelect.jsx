import React, { useContext, useEffect } from "react";
import { FormControl, Box, Autocomplete, TextField } from "@mui/material";
import { BookContext } from "./Book";

export default function GenreSelect({ initial, onChange }) {
  const { genres, genre, setGenre } = useContext(BookContext);

  useEffect(() => {
    if (initial && genres?.length > 0) {
      const initialGenre = genres.find((g) => g.genre_name === initial);
      if (initialGenre) {
        setGenre(initialGenre.genre_name);
      }
    }
  }, [initial, genres, setGenre]);

  const handleGenreChange = (event, value) => {
    setGenre(value);
    if (onChange) onChange(value);
  };

  const genresList = genres?.map((item) => item.genre_name);

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          isOptionEqualToValue={(option, value) =>
            option === value || value === ""
          }
          options={genresList || []}
          value={genre || ""}
          renderInput={(params) => <TextField {...params} label="หมวดหมู่" />}
          onChange={handleGenreChange}
        />
      </FormControl>
    </Box>
  );
}
