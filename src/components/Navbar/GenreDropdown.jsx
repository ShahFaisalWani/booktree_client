import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GenreDropdown = ({ genre }) => {
  const navigateTo = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelect = (selectedValue) => {
    setAnchorEl(null);
    if (genre.name == "ผู้เขียน") navigateTo(`/books?author=${selectedValue}`);
    else if (genre.name == "สำนักพิมพ์")
      navigateTo(`/books?publisher=${selectedValue}`);
    else navigateTo(`/books?genre=${selectedValue}`);
  };
  return (
    <div className="Dropdown">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "black" }}
      >
        {genre.name}
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {genre?.subGenres.map((sub) => (
          <MenuItem
            key={sub}
            value={sub}
            onClick={() => {
              handleClose;
              handleSelect(sub);
            }}
          >
            {sub}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default GenreDropdown;
