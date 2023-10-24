import { createContext, useState } from "react";

export const BookContext = createContext();

export default function BookProvider({ children }) {
  const [method, setMethod] = useState("");
  const [supplier, setSupplier] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [genre, setGenre] = useState("");
  const [item, setItem] = useState("book");

  return (
    <BookContext.Provider
      value={{
        method,
        setMethod,
        supplier,
        setSupplier,
        coverImg,
        setCoverImg,
        genre,
        setGenre,
        item,
        setItem,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}
