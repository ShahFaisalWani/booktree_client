import React, { useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import ProfileModal from "./ProfileModal";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30vw",
  height: "fit",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
};

const Profile = () => {
  const user = useSelector((state) => state.user);
  const handleEdit = () => {
    setOpen(true);
  };

  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-[50vw]">
      <p className="border-b-2 w-full mb-10 pb-5 text-lg text-blue-500 font-bold tracking-wider">
        ประวัติของฉัน
      </p>
      {user && (
        <div className="flex h-1/2 w-full gap-10 ">
          <div className="my-auto">
            <Avatar
              sx={{ width: 170, height: 170, fontSize: 50 }}
              children={`${user.first_name[0]}${user.last_name[0]}`}
            />
          </div>
          <div className="w-2/3 my-auto flex flex-col gap-4 mr-10">
            <p className="flex justify-between">
              <span>บัญชีของ</span>
              <span>
                {user.first_name} {user.last_name}
              </span>
            </p>
            <p className="flex justify-between">
              <span>อีเมล</span>
              <span>{user.email}</span>
            </p>
            <p className="flex justify-between">
              <span>เบอร์โทร</span>
              <span>{user.phone_number}</span>
            </p>
            <p className="flex justify-between">
              <span>ที่อยู่</span>
              <span>{user.address}</span>
            </p>
            <p className="flex justify-between">
              <span>วันที่ลงทะเบียน</span>
              <span>
                {new Date(user.signed_up_on).toISOString().split("T")[0]}
              </span>
            </p>
          </div>
          <button onClick={handleEdit} className="flex gap-1">
            <span>แก้ไข</span>
            <EditIcon />
          </button>
          <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
                >
                  <CloseIcon fontSize="medium" />
                </button>
                <div className="flex flex-col justify-center items-center p-16">
                  <ProfileModal user={user} onClose={onClose} />
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Profile;
