import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const navigateTo = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const keyword = e.target.keyword.value;
    e.target.keyword.value = "";
    if (keyword.length !== 0) return navigateTo("/search?keyword=" + keyword);
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input type="text" name="keyword" placeholder="ค้นหา" />
      <button type="submit">
        <SearchIcon className="icon" style={{ fill: "grey" }} />
      </button>
    </form>
  );
};

export default Searchbar;
