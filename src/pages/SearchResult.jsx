import React, { useState, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import LoadingScreen from "../components/Loading/LoadingScreen";
import BooksDisplay from "../components/BooksDisplay";
import { SortContext } from "../App";

const limit = 10;

export const SearchContext = createContext();

const SearchResult = () => {
  const location = useLocation();
  const [totalCount, setTotalCount] = useState(0);
  const [books, setBooks] = useState([]);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const keyword = location.search.split("=")[1] || "";
  const { type } = useContext(SortContext);

  const navigateTo = useNavigate();

  const url = `/book/search?keyword=${keyword}&offset=${
    (page - 1) * limit
  }&limit=${limit}&sort=${type?.sort}&way=${type?.way}`;

  const fetchMyData = async () => {
    const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
    // if (res.data.books.length == 0) return navigateTo("/");

    setTotalCount(res.data.total_count);
    setBooks(res.data.books);
    setPages(Math.ceil(res.data.total_count / limit));
    return res.data;
  };

  const { isLoading, error, data } = useQuery(
    ["search", keyword, location.search, page, type?.sort, type?.way],
    fetchMyData
  );

  const handleChange = (value) => {
    setPage(value);
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <p>Error</p>;

  return (
    <SearchContext.Provider
      value={{
        type,
      }}
    >
      <p className="text-lg mb-2 px-20">
        ผลการค้นหา : {decodeURIComponent(keyword)}
      </p>
      <BooksDisplay
        books={books}
        page={page}
        pages={pages}
        totalCount={totalCount}
        handlePageChange={handleChange}
      />
    </SearchContext.Provider>
  );
};

export default SearchResult;
