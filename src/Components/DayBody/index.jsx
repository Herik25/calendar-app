import React from "react";

// Helper function to generate time slots from 00:00 to 23:00
const generateTimeSlots = () =>
  [...Array(24).keys()].map((hour) =>
    hour < 10 ? `0${hour}:00` : `${hour}:00`
  );

function DayBody({day}) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // const date = new Date();
  // Time slots from 00:00 to 23:00
  const timeSlots = generateTimeSlots();
  const currentDay = daysOfWeek[day]; // Get the current day
  
  return (
    <div className="p-4">
      {/* Day Header */}
      <div className=" font-bold text-base m-2">{currentDay}</div>

      {/* Day Grid (24 rows for time slots) */}
      <div className="grid grid-cols-[0.5fr_9.5fr] ">
        {/* First Column for Time Slots */}
        <div className="flex flex-col">
          {timeSlots.map((time, index) => (
            <div key={index} className="h-16 flex items-start justify-end px-2">
              {time}
            </div>
          ))}
        </div>

        {/* Second Column for Appointments */}
        <div className="flex flex-col">
          {timeSlots.map((_, index) => (
            <div
              key={index}
              className="min-h-16 flex flex-col gap-1 items-center p-2 border border-gray-300"
            >
              {/* TODO: Dynamic Data from BackEnd */}
              {/* <div className=" bg-pink-300 text-sm py-1 px-2 rounded-md font-semibold w-full">
                something
              </div> */}
              {/* TODO : when this section expands the time height is still 16 */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DayBody;
