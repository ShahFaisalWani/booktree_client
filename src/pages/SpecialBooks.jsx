import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import LoadingScreen from "../components/Loading/LoadingScreen";
import BooksDisplay from "../components/BooksDisplay";
import { SortContext } from "../App";

const limit = window.innerWidth < 640 ? 20 : 25;

const typeArray = {
  topsales: { name: "หนังสือยอดนิยม", url: "topsales" },
  newarrivals: { name: "หนังสือเข้าใหม่", url: "newarrivals" },
  recommends: { name: "หนังสือแนะนำ", url: "recommend" },
};
const SpecialBooks = () => {
  const path = useParams();
  const [totalCount, setTotalCount] = useState(0);
  const [books, setBooks] = useState([]);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState(null);

  const { type, setType } = useContext(SortContext);

  useEffect(() => {
    setTitle(typeArray[path.type]);
  }, []);

  const fetchMyData = async () => {
    const offset = (page - 1) * limit;
    let url = "";
    let tail = `?offset=${offset}&limit=${limit}&sort=${type?.sort}&way=${type?.way}`;

    if (path.type == "topsales") url = "topsales" + tail;
    else if (path.type == "newarrivals") url = "newarrivals" + tail;
    else if (path.type == "recommends") url = "recommend" + tail;

    const res = await axios.get(
      import.meta.env.VITE_API_BASEURL + "/book/" + url
    );
    setTotalCount(res.data.total_count);
    setBooks(res.data.books);
    setPages(Math.round(res.data.total_count / limit));
    return res.data;
  };

  const { isLoading, error, data } = useQuery(
    [path, page, type?.sort, type?.way],
    fetchMyData
  );

  const handleChange = (value) => {
    setPage(value);
  };

  if (!books) return <>No Books</>;

  if (isLoading) return <LoadingScreen />;
  if (error) return <p>Error</p>;

  return (
    <div>
      <div className="w-full flex justify-center items-center">
        <p className="text-2xl">{title?.name}</p>
      </div>
      <BooksDisplay
        books={books}
        page={page}
        pages={pages}
        totalCount={totalCount}
        handlePageChange={handleChange}
        show={title?.url == "newarrivals" ? "no" : "yes"}
      />
    </div>
  );
};

export default SpecialBooks;
