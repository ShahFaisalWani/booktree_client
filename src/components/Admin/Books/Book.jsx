import { createContext, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import LoadingScreen from "../../Loading/LoadingScreen";

export const BookContext = createContext();

export default function BookProvider({ children }) {
  const [method, setMethod] = useState("");
  const [supplier, setSupplier] = useState("");
  const [publisher, setPublisher] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [genre, setGenre] = useState("");
  const [item, setItem] = useState("book");

  // Fetch suppliers with react-query and cache the data
  const fetchSuppliers = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASEURL}/book/suppliers`
    );
    return res.data;
  };

  const fetchGenres = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASEURL}/book/genres`
    );
    return res.data;
  };

  const {
    data: suppliers = [],
    isLoading: isLoadingSuppliers,
    isError: isErrorSuppliers,
  } = useQuery(["suppliers"], fetchSuppliers);

  const {
    data: genres = [],
    isLoading: isLoadingGenres,
    isError: isErrorGenres,
  } = useQuery(["genres"], fetchGenres);

  if (isLoadingSuppliers || isLoadingGenres) {
    return <LoadingScreen />;
  }

  return (
    <BookContext.Provider
      value={{
        method,
        setMethod,
        supplier,
        setSupplier,
        publisher,
        setPublisher,
        coverImg,
        setCoverImg,
        genre,
        setGenre,
        item,
        setItem,
        suppliers,
        genres,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}
