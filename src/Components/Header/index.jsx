import React from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";

function Header() {
  const date = new Date();
  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const currentMonth = monthNames[date.getMonth()];
  const currentYear = date.getFullYear();

  return (
    <div className="flex justify-between items-center p-2">
      <div className=" text-3xl font-light flex items-center gap-3">
        <span className="font-medium">{currentMonth}</span>
        <span>{currentYear}</span>
      </div>
      <div className=" flex items-center font-medium text-sm">
        <div className=" flex items-center gap-1 px-4 py-3 border-[1px] border-l-black rounded-l-full border-t-black border-b-black border-r-black">
          <FaCheck /> Month
        </div>
        <div className=" px-4 py-3 border-[1px] border-t-black border-b-black border-r-black">
          Week
        </div>
        <div className="px-4 py-3 border-[1px] border-r-black rounded-r-full border-t-black border-b-black ">
          Day
        </div>
      </div>
      <div className=" flex items-center gap-5">
        <div className=" flex gap-1 items-center">
          <div className=" text-2xl">
            <BiChevronLeft />
          </div>
          <div className="text-secondary font-bold text-sm border-[1px] border-black rounded-full px-5 py-2">
            Today
          </div>
          <div className=" text-2xl">
            <BiChevronRight />
          </div>
        </div>
        <div className=" bg-primary py-3 px-5 text-white rounded-full">
          Add Appointment
        </div>
      </div>
    </div>
  );
}

export default Header;
