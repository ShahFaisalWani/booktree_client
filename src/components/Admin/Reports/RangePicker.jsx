import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function RangePicker({
  start,
  end,
  onStartChange,
  onEndChange,
}) {
  const handleStartChange = (e) => {
    onStartChange(
      (e.$M + 1).toString() + "/" + e.$D.toString() + "/" + e.$y.toString()
    );
  };
  const handleEndChange = (e) => {
    onEndChange(
      (e.$M + 1).toString() + "/" + e.$D.toString() + "/" + e.$y.toString()
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateRangePicker"]}>
        <div className="flex gap-10">
          <DatePicker
            label="Start Date"
            value={start ? dayjs(start) : null}
            onChange={handleStartChange}
          />
          <DatePicker
            label="End Date"
            value={start ? dayjs(end) : null}
            onChange={handleEndChange}
          />
        </div>
      </DemoContainer>
    </LocalizationProvider>
  );
}
