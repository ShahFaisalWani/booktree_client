import React, { useState } from "react";
import MemberForm from "./MemberForm";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import MemberCard from "./MemberCard";
import html2canvas from "html2canvas";

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
const styleS = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40vw",
  height: "fit",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
};

const Member = () => {
  const [open, setOpen] = useState(false);
  const [openS, setOpenS] = useState(false);
  const [member, setMember] = useState();

  const closeModal = () => {
    setOpen(false);
  };
  const download = () => {
    const domElement = document.getElementById("canvas"); // Select the element you want to capture. Select the <body> element to capture full page.
    html2canvas(domElement, {
      allowTaint: true,
      useCors: true,
    }).then((canvas) => {
      const image = canvas.toDataURL("png");
      const a = document.createElement("a");
      a.setAttribute("download", member.member_id + ".png");
      a.setAttribute("href", image);
      a.click();
    });
  };
  const onSuccess = (memberData, res) => {
    setOpen(false);
    setOpenS(true);
    setMember({ ...memberData, ...res });
  };

  return (
    <div className="">
      <p className="border-b-2 w-full mb-10 pb-5 text-lg text-blue-500 font-bold tracking-wider">
        สมาชิก
      </p>
      <div className="pb-6 text-gray-700">
        <p className="pb-2 text-black text-[18px]">
          สิทธิพิเศษสำหรับสมาชิก Booktree
        </p>
        <ul>
          <li className="mb-2">- ราคาสมาชิก 150 บาท ต่อ ปี</li>
          <li className="mb-2">
            - ทำบัตรสมาชิกครั้งแรกรับกระเป๋าผ้า 1 ใบ เมื่อทำรายการซื้อครั้งแรก
            <p className="mb-2">- ลด 5% ต่อเล่ม</p>
          </li>
          <li className="mb-2 text-red-500">
            - ยกเว้นนิตยสารและเครื่องเขียนไม่ลด
          </li>
        </ul>
      </div>

      <div>
        <button
          onClick={() => setOpen(true)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none hover:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          สมัครสมาชิก
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
            >
              <CloseIcon fontSize="medium" />
            </button>
            <div className="flex justify-center items-center p-16">
              <MemberForm closeModal={closeModal} onSuccess={onSuccess} />
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openS}
        aria-labelledby="modal-modal-titleS"
        aria-describedby="modal-modal-descriptionS"
      >
        <Box sx={styleS}>
          <div className="">
            <button
              onClick={() => setOpenS(false)}
              className="absolute right-7 top-7 text-gray-400 hover:text-red-400"
            >
              <CloseIcon fontSize="medium" />
            </button>
            <div className="flex flex-col justify-center items-center p-16">
              <p className="text-lg text-green-500 mb-6">
                คุณเป็นสมาชิก Booktree เรียบร้อย
              </p>
              <div id="canvas" className="mb-6">
                <MemberCard id="canvas" member={member} />
              </div>
              <div className="">
                <button
                  onClick={download}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none hover:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  ดาวน์โหลด
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Member;
