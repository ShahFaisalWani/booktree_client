import React, {
  useState,
  useEffect,
  useContext,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import SingleBook from "./SingleBook";
import axios from "axios";
import LoadingScreen from "../Loading/LoadingScreen";
import { toast } from "react-hot-toast";
import { BookContext } from "./Books/Book";

const BooksList = forwardRef((props, ref) => {
  const { excelBooks, onFinish, hidden } = props;
  const { supplier, setSupplier } = useContext(BookContext);
  const [books, setBooks] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setBooks(excelBooks);
  }, [excelBooks]);

  const handleBookChange = (updatedBook) => {
    const updatedList = books.map((book) => {
      if (book.ISBN === updatedBook.ISBN) {
        return updatedBook;
      }
      return book;
    });
    setBooks(updatedList);
  };

  const handleRemoveBook = (ISBN) => {
    const updatedList = books.filter((book) => book.ISBN !== ISBN);
    setBooks(updatedList);
  };

  const handleClick = async () => {
    if (!supplier || supplier.supplier_name == "All")
      return toast.error("เลือกตัวแทนจำหน่าย");

    setIsLoading(true);

    const booksWithImage = books.filter((book) => book.cover_img);

    books.map((book) => {
      book.ISBN = book.ISBN.toString().trim();
      book.supplier_name = supplier.supplier_name;
    });

    await axios
      .post(import.meta.env.VITE_API_BASEURL + "/book/add", books)
      .then((res) => {
        toast.success(`เพิ่มสำเร็จ`);
        setBooks([]);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });

    if (booksWithImage.length > 0) {
      await Promise.all(
        booksWithImage.map(async (book) => {
          const formData = new FormData();
          formData.append("cover_img", book.cover_img);
          formData.append("ISBN", book.ISBN);
          formData.append("item", "book");

          await axios
            .post(
              import.meta.env.VITE_API_BASEURL + "/upload/book_cover",
              formData
            )
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
        })
      );
    }

    onFinish();
    setIsLoading(false);
  };

  useImperativeHandle(ref, () => ({
    submitBooks() {
      handleClick();
    },
  }));

  return (
    <div hidden={hidden}>
      {isLoading && <LoadingScreen />}
      {books?.length > 0 && (
        <>
          <div className="max-h-[600px] overflow-y-auto">
            {books.map((book) => (
              <SingleBook
                key={book.ISBN}
                book={book}
                handleBookChange={handleBookChange}
                handleRemoveBook={handleRemoveBook}
              />
            ))}
          </div>
          <div className="h-10 w-full flex justify-center mt-4">
            <button
              className="text-white w-1/4 text-lg flex justify-center items-center bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full px-4 py-2 text-center"
              onClick={handleClick}
            >
              เพิ่ม
            </button>
          </div>
        </>
      )}
    </div>
  );
});

export default BooksList;
