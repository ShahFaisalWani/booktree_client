import React from "react";
import "../../styles/MemberCard.scss";
import logo from "../../assets/logo.jpg";
const MemberCard = ({ member }) => {
  const { member_id, first_name, last_name, start_date, end_date } = member;
  return (
    <div className="MemberCard">
      <div className="card">
        <img src={logo} className="card__img" />
        <span className="card__footer">
          <span className="text-xl">รหัสสมาชิก: {member_id}</span>
          <span>
            ชื่อ: {first_name} {last_name}
          </span>
          <span>
            วันออกบัตร: {start_date} วันหมดอายุ: {end_date}
          </span>
        </span>
      </div>
    </div>
  );
};

export default MemberCard;
