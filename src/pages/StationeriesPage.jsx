import React from "react";
import BookCard from "../components/BookCard";
import { useQuery } from "react-query";
import axios from "axios";
import StationeryCard from "../components/StationeryCard";

const StationeriesPage = () => {
  const url = "/stationery/getAll";

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    return res.data;
  };

  const { isLoading, error, data } = useQuery(["stationeries"], fetchMyData);

  return (
    <div className="pt-10 px-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ">
      {data?.map((item) => (
        <StationeryCard key={item.ISBN} item={item} />
      ))}
    </div>
  );
};

export default StationeriesPage;
