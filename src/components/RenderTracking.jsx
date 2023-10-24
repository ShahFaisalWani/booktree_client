import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import StatusSelect from "./StatusSelect";

const RenderTracking = ({ order_id, track_id }) => {
  if (track_id !== "-") {
    const [deliState, setDeliState] = useState(null);

    useEffect(() => {
      const getTracking = async () => {
        if (track_id) {
          const url =
            "https://api.track123.com/gateway/open-api/tk/v2/track/query";
          const body = {
            trackNos: [track_id],
            queryPageSize: 100,
          };
          const header = {
            headers: {
              "Track123-Api-Secret": import.meta.env.VITE_TRACK123_API,
              "Content-Type": "application/json",
            },
          };
          try {
            const res = await axios.post(url, body, header);
            const id = parseInt(order_id.split("INV")[1]);

            if (res.data?.data?.accepted.content.length > 0) {
              let trackStatus =
                res.data.data?.accepted?.content[0]?.localLogisticsInfo
                  .trackingDetails[0]?.eventDetail;
              if (trackStatus == "Final delivery,Successful") {
                trackStatus = "completed";
              }
              const query = `id=${id}&status=${trackStatus}`;
              await axios.put(
                import.meta.env.VITE_API_BASEURL + "/order/status?" + query
              );
              setDeliState(trackStatus);
            } else if (res.data?.data?.rejected.length > 0) {
              let trackStatus = "delivering";
              const query = `id=${id}&status=${trackStatus}`;
              await axios.put(
                import.meta.env.VITE_API_BASEURL + "/order/status?" + query
              );
              setDeliState("delivering");
            } else {
              setDeliState(null);
            }
          } catch (error) {
            console.error(error);
            setDeliState(null);
          }
        }
      };

      getTracking();
    }, [track_id]);

    if (deliState) {
      return (
        <div className="flex items-center justify-center h-16">
          <StatusSelect
            key={`${order_id}-${deliState}`}
            order_id={order_id}
            status={deliState}
          />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-16">
          <CircularProgress size={24} />
        </div>
      );
    }
  } else return <p className="m-auto">-</p>;
};

export default RenderTracking;
