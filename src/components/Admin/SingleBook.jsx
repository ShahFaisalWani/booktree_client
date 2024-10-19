import React, { useEffect, useState } from "react";
import ExcelGenreSelect from "./Books/ExcelGenreSelect";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditDialog from "./Books/EditDialog";
import ImgInput from "./Books/ImgInput";
import ExcelPublisherSelect from "./Books/ExcelPublisherSelect";

const SingleBook = ({ book, handleBookChange, handleRemoveBook }) => {
  const [modifiedBook, setModifiedBook] = useState(book);
  const [open, setOpen] = useState(false);

  const handleImgChange = (file) => {
    const updatedBook = { ...modifiedBook, cover_img: file };
    setModifiedBook(updatedBook);
    handleBookChange(updatedBook);
  };
  const handleGenreChange = (genre) => {
    const updatedBook = { ...modifiedBook, genre: genre };
    setModifiedBook(updatedBook);
    handleBookChange(updatedBook);
  };

  const handlePublisherChange = (pub) => {
    const updatedBook = { ...modifiedBook, publisher: pub };
    setModifiedBook(updatedBook);
    handleBookChange(updatedBook);
  };

  const handleRemove = (ISBN) => {
    handleRemoveBook(ISBN);
  };

  const handleChangeInitial = (updatedBook) => {
    setModifiedBook(updatedBook);
    handleBookChange(updatedBook);
  };

  return (
    <div className="w-full h-36 border-2 flex gap-4 px-8 py-4 items-center my-4">
      <div className="w-[10%]">{modifiedBook.ISBN}</div>
      <div className="w-[7%]">
        <ImgInput
          selectedImg={modifiedBook.cover_img || null}
          handleImgChange={handleImgChange}
        />
      </div>
      <div className="w-[30%] flex flex-col gap-5">
        <p className="font-bold">{modifiedBook.title}</p>
        <p className="text-sm text-gray-500">ผู้แต่ง: {modifiedBook.author}</p>
        <p className="text-sm text-gray-500">
          ผู้แปล: {modifiedBook.translator}
        </p>
      </div>
      <div className="w-[20%]">
        <p>หมวดหมู่เดิม: {modifiedBook.old_genre}</p>
        <ExcelGenreSelect
          handleGenreChange={handleGenreChange}
          selectedGenre={modifiedBook.genre || null}
        />
      </div>
      <div className="w-[20%]">
        <p>สำนักพิมพ์เดิม: {modifiedBook.old_publisher}</p>
        <ExcelPublisherSelect
          handlePublisherChange={handlePublisherChange}
          selectedPublisher={modifiedBook.publisher || null}
        />
      </div>
      <div className="w-[5%]">{modifiedBook.price}</div>
      <div className="w-[10%] flex gap-5 justify-center">
        <button className="text-blue-500" onClick={() => setOpen(true)}>
          Edit
        </button>
        <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
          <DialogTitle>Edit</DialogTitle>
          <DialogContent>
            <EditDialog
              initial={modifiedBook}
              changeInitial={handleChangeInitial}
              onClose={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <button
          className="text-red-500"
          onClick={() => handleRemove(modifiedBook.ISBN)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SingleBook;
