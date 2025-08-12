import React, { useEffect, useState } from "react";
import { FormControl, Box, Autocomplete, TextField } from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { useBookContext } from "../../../contexts/admin/BookContext";

export default function PublisherSelect({
  initial,
  onChange,
  supplierName,
  value = null,
  useLocalState = false,
}) {
  const {
    publisher,
    supplier,
    setPublisher,
    getCachedPublishers,
    queryClient,
  } = useBookContext();
  const [localValue, setLocalValue] = useState("");

  // Determine which value to use
  const currentValue = useLocalState
    ? localValue
    : value !== null
    ? value
    : publisher;

  // Determine the target supplier - handle both string and object cases
  const targetSupplier =
    supplierName?.supplier_name || supplierName || supplier?.supplier_name;

  // Fetch publishers with enhanced caching
  const fetchPublishers = async () => {
    if (!targetSupplier || targetSupplier === "All") return [];

    const res = await axios.get(
      `${
        import.meta.env.VITE_API_BASEURL
      }/publisher/getall?supplier_name=${targetSupplier}`
    );
    return res.data;
  };

  const {
    isLoading,
    error,
    data: publishersData,
    refetch,
  } = useQuery(["publishers", targetSupplier], fetchPublishers, {
    enabled: !!(targetSupplier && targetSupplier !== "All"),
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000, // 3 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    // Use cached data immediately if available
    initialData: () => getCachedPublishers(targetSupplier),
  });

  useEffect(() => {
    if (initial && publishersData?.length > 0) {
      const initialPublisher = publishersData.find(
        (p) => p.publisher_name === initial
      );
      if (initialPublisher) {
        const publisherName = initialPublisher.publisher_name;
        if (useLocalState) {
          setLocalValue(publisherName);
        } else {
          setPublisher(publisherName);
        }
        // Always call onChange to notify parent
        onChange?.(publisherName);
      }
    }
  }, [initial, publishersData, setPublisher, onChange, useLocalState]);

  // Track previous supplier to detect changes
  const [previousSupplier, setPreviousSupplier] = useState("");

  // Clear publisher when supplier changes
  useEffect(() => {
    // Initialize previous supplier on first render
    if (!previousSupplier && targetSupplier) {
      setPreviousSupplier(targetSupplier);
      return;
    }

    // Only clear if supplier actually changed
    if (targetSupplier !== previousSupplier) {
      if (useLocalState) {
        setLocalValue("");
      } else {
        setPublisher("");
      }
      // Notify parent of the change
      onChange?.("");

      setPreviousSupplier(targetSupplier);
    }
  }, [targetSupplier, previousSupplier, useLocalState, setPublisher, onChange]);

  // Update local value when external value changes (for controlled mode)
  useEffect(() => {
    if (useLocalState && value !== null && value !== localValue) {
      setLocalValue(value);
    }
  }, [value, useLocalState, localValue]);

  const handlePublisherChange = (event, selectedValue) => {
    const newValue = selectedValue || "";
    if (useLocalState) {
      setLocalValue(newValue);
    } else {
      setPublisher(newValue);
    }
    onChange?.(selectedValue);
  };

  const publishersList =
    publishersData?.map((item) => item.publisher_name) || [];

  if (isLoading && !publishersData) {
    return (
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          <TextField
            disabled
            placeholder="Loading publishers..."
            size="small"
          />
        </FormControl>
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <Autocomplete
          key={targetSupplier} // Force re-render when supplier changes
          disablePortal
          isOptionEqualToValue={(option, value) =>
            option === value || value === ""
          }
          options={publishersList}
          value={currentValue || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={
                !targetSupplier ? "Select supplier first" : "Select publisher"
              }
            />
          )}
          onChange={handlePublisherChange}
          disabled={!publishersList.length || !targetSupplier}
          loading={isLoading}
        />
      </FormControl>
    </Box>
  );
}
