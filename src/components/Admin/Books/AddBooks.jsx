import React, { useContext, useEffect, useState } from "react";
// import MethodSelect from "./MethodSelect";
import SupplierSelect from "./SupplierSelect";
import ManualForm from "./ManualForm";
import AddExcel from "./AddExcel";
import BookProvider, { BookContext } from "./Book";
import ItemSelect from "./ItemSelect";
import ItemForm from "./ItemForm";
import BooksList from "../BooksList";

const getData = () => {
  const { item, method, supplier } = useContext(BookContext);
  return { item, method, supplier };
};

const Test = ({ onChange, books }) => {
  const { item, method, supplier } = getData();
  useEffect(() => {
    onChange({ item, method, supplier });
  }, [item, method, supplier]);
  if (item == "book" && supplier) {
    return <ManualForm />;
  } else if (item == "other" && supplier) {
    return <ItemForm />;
  } else {
    return <BooksList excelBooks={books} />;
  }
};

const AddBooks = () => {
  const [item, setItem] = useState("");
  const [excelBooks, setExcelBooks] = useState([]);

  function handleChange(e) {
    setItem(e.item);
  }

  function onChange(books) {
    setExcelBooks(books);
  }

  return (
    <BookProvider>
      <div className="flex w-full px-16 mb-16 gap-16 items-center">
        <div className="w-1/3">
          <ItemSelect />
        </div>
        <div className="w-1/3">
          <SupplierSelect />
        </div>
        {item == "book" && (
          <div className="w-1/3">
            <AddExcel onChange={(books) => onChange(books)} />
          </div>
        )}
      </div>
      <div>
        <Test onChange={(e) => handleChange(e)} books={excelBooks} />
      </div>
    </BookProvider>
  );
};

export default AddBooks;
