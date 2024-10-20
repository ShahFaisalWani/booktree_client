import React, { useContext, useEffect } from "react";
import { FormControl, Box, Autocomplete, TextField } from "@mui/material";
import { BookContext } from "./Book";
import axios from "axios";
import { useQuery } from "react-query";

export default function PublisherSelect({ initial, onChange, supplierName }) {
  const { publisher, supplier, setPublisher } = useContext(BookContext);
  const fetchPublishers = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASEURL +
        "/publisher/getall" +
        `?supplier_name=${supplierName || supplier.supplier_name}`
    );
    return res.data;
  };

  const {
    isLoading,
    error,
    data: publishersData,
  } = useQuery(["publishers", supplier, supplierName], fetchPublishers);

  useEffect(() => {
    if (initial && publishersData) {
      const initialPublisher = publishersData?.find(
        (p) => p.publisher_name === initial
      );
      if (initialPublisher) {
        setPublisher(initialPublisher.publisher_name);
      }
    }
  }, [initial, publishersData, setPublisher]);

  const handlePublisherChange = (event, value) => {
    setPublisher(value);
    if (onChange) onChange(value);
  };

  const publishersList = publishersData?.map((item) => item.publisher_name);

  if (isLoading) return;
  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          isOptionEqualToValue={(option, value) =>
            option === value || value === ""
          }
          options={publishersList || []}
          value={publisher || ""}
          renderInput={(params) => <TextField {...params} />}
          onChange={handlePublisherChange}
        />
      </FormControl>
    </Box>
  );
}
