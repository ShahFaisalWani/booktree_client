import React, { lazy, Suspense, useState } from "react";
import "../styles/Home.scss";
import LoadingScreen from "../components/Loading/LoadingScreen";
import BookModal from "../components/BookModal";
import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

const BookCard = lazy(() => import("../components/BookCard"));

const limit = 5;

const Home = () => {
  const [topBooks, seTopBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [recommendBooks, setRecommendBooks] = useState([]);

  const fetchMyData = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_BASEURL +
        "/book/topsales" +
        "?offset=" +
        0 +
        "&limit=" +
        limit +
        "&sort=default&way=0"
    );
    seTopBooks(res.data.books);
    const res1 = await axios.get(
      import.meta.env.VITE_API_BASEURL +
        "/book/newarrivals" +
        "?offset=" +
        0 +
        "&limit=" +
        limit +
        "&sort=default&way=0"
    );
    setNewBooks(res1.data.books);
    const res2 = await axios.get(
      import.meta.env.VITE_API_BASEURL +
        "/book/recommend" +
        "?offset=" +
        0 +
        "&limit=" +
        limit +
        "&sort=default&way=0"
    );
    setRecommendBooks(res2.data.books);
    return;
  };
  const { isLoading, error, data } = useQuery(
    ["best seller", "new arrivals", "recommend"],
    fetchMyData
  );

  const navigateTo = useNavigate();

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="grid grid-cols-1">
      <div className="w-full py-4 mb-10">
        <div className="mb-16 px-20 flex justify-between">
          <div>
            <span className="text-3xl font-semibold">Best seller</span>
            <span className="relative top-[20px] left-[-40px] text-[30px] font-sacramento">
              best seller
            </span>
          </div>
          <div className="w-1/6">
            <button
              onClick={() => navigateTo("/books/topsales")}
              type="button"
              className="w-full text-white bg-gray-400 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full px-2 py-4"
            >
              ดูเพิ่มเติม
            </button>
          </div>
        </div>

        <div>
          <div className="grid justify-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {topBooks.map((book, i) => (
              <div key={i} className="relative">
                <div className="star absolute right-[45px] top-[24px] flex place-start pt-[0.33rem] text-sm justify-center">
                  {i + 1}
                </div>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full py-4 mb-10">
        <div className="mb-16 px-20 flex justify-between">
          <div>
            <span className="text-3xl font-semibold">New arrival</span>
            <span className="relative top-[10px] left-[-40px] text-[30px] font-sacramento">
              new arrival
            </span>
          </div>
          <div className="w-1/6">
            <button
              onClick={() => navigateTo("/books/newarrivals")}
              type="button"
              className="w-full text-white bg-gray-400 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full px-2 py-4"
            >
              ดูเพิ่มเติม
            </button>
          </div>
        </div>
        <div>
          <div className="grid justify-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {newBooks.map((book, i) => (
              <BookCard key={i} book={book} />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full py-4 mb-10">
        <div className="mb-16 px-20 flex justify-between">
          <div>
            <span className="text-3xl font-semibold">Recommend</span>
            <span className="relative top-[10px] left-[-40px] text-[30px] font-sacramento">
              recommend
            </span>
          </div>
          <div className="w-1/6">
            <button
              onClick={() => navigateTo("/books/recommends")}
              type="button"
              className="w-full text-white bg-gray-400 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full px-2 py-4"
            >
              ดูเพิ่มเติม
            </button>
          </div>
        </div>
        <div>
          <div className="grid justify-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recommendBooks.map((book, i) => (
              <BookCard key={i} book={book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
