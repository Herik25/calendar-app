import React from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";

function Header({
  showBody,
  setShowBody,
  month,
  setMonth,
  day,
  setDay,
  goToPreviousWeek,
  goToNextWeek,
}) {
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

  const currentMonth = monthNames[month];
  const currentYear = date.getFullYear();

  return (
    <div className="flex justify-between items-center p-2">
      <div className=" text-3xl font-light flex items-center gap-3">
        <span className="font-medium">{currentMonth}</span>
        <span>{currentYear}</span>
      </div>
      <div className=" flex items-center font-medium text-sm">
        <div
          onClick={() => setShowBody("month")}
          className=" cursor-pointer flex items-center gap-1 px-4 py-3 border-[1px] border-l-black rounded-l-full border-t-black border-b-black border-r-black"
        >
          {showBody === "month" && <FaCheck />}
          Month
        </div>
        <div
          onClick={() => setShowBody("week")}
          className="cursor-pointer flex items-center gap-1 px-4 py-3 border-[1px] border-t-black border-b-black border-r-black"
        >
          {showBody === "week" && <FaCheck />}
          Week
        </div>
        <div
          onClick={() => setShowBody("day")}
          className="cursor-pointer flex items-center gap-1 px-4 py-3 border-[1px] border-r-black rounded-r-full border-t-black border-b-black "
        >
          {showBody === "day" && <FaCheck />}
          Day
        </div>
      </div>
      <div className=" flex items-center gap-5">
        <div className=" flex gap-1 items-center">
          <div
            className=" text-2xl cursor-pointer"
            onClick={() => {
              if (showBody === "month") {
                if (month === 0) {
                  setMonth(0);
                } else {
                  setMonth(month - 1);
                }
              } else if (showBody === "week") {
                goToPreviousWeek();
              } else if (showBody === "day") {
                if (day === 0) {
                  setDay(6);
                } else {
                  setDay(day - 1);
                }
              }
            }}
          >
            <BiChevronLeft />
          </div>
          <div className="text-secondary font-bold text-sm border-[1px] border-black rounded-full px-5 py-2">
            {showBody === "day" && "Today"}
            {showBody === "week" && "Week"}
            {showBody === "month" && "Month"}
          </div>
          <div
            className=" text-2xl cursor-pointer"
            onClick={() => {
              if (showBody === "month") {
                if (month === 11) {
                  setMonth(11);
                } else {
                  setMonth(month + 1);
                }
              } else if (showBody === "week") {
                goToNextWeek();
              } else if (showBody === "day") {
                if (day === 6) {
                  setDay(0);
                } else {
                  setDay(day + 1);
                }
              }
            }}
          >
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
