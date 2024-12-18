import React, { useContext } from "react";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { BookContext } from "./Book";

export default function ExcelPublisherSelect({
  handlePublisherChange,
  selectedPublisher,
}) {
  const { publishers } = useContext(BookContext);
  const handleChange = (value) => {
    handlePublisherChange(value);
  };

  const publishersList =
    publishers &&
    publishers
      .map((item) => item.publisher_name)
      .sort((a, b) => a.localeCompare(b));

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        {publishersList && (
          <Autocomplete
            value={selectedPublisher}
            options={publishersList}
            renderInput={(params) => <TextField {...params} />}
            onChange={(event, value) => handleChange(value)}
          />
        )}
      </FormControl>
    </Box>
  );
}
