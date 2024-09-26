import React from "react";

// Helper function to get the start of the week (Sunday)
const getStartOfWeek = (date) => {
  const start = new Date(date);
  const day = start.getDay(); // 0 is Sunday, 6 is Saturday
  const diff = start.getDate() - day; // Subtracting the current day to get Sunday
  return new Date(start.setDate(diff));
};

// Helper function to format the date for each day (e.g., "Sun 22")
const formatDay = (date) => {
  const options = { weekday: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const [weekday, day] = formattedDate.split(" "); // Extract weekday and day
  return `${day} ${weekday}`; // Revert the order to "Sun 22"
};

function WeekBody() {
  const date = new Date();
  const startOfWeek = getStartOfWeek(date);

  // Days of the week array starting from Sunday
  const daysOfWeek = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    return formatDay(day);
  });

  // Time slots from 00:00 to 23:00
  const timeSlots = [...Array(24).keys()].map((hour) =>
    hour < 10 ? `0${hour}:00` : `${hour}:00`
  );

  return (
    <div className="p-4">
      {/* Week Header */}
      <div className="grid grid-cols-[1fr_3fr_3fr_3fr_3fr_3fr_3fr_3fr] text-right gap-1 text-lg">
        <div></div>
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      {/* Week Grid (24 rows for time slots) */}
      <div className="grid grid-cols-[1fr_3fr_3fr_3fr_3fr_3fr_3fr_3fr]">
        {/* First Column for Time Slots */}
        <div className="flex flex-col">
          {timeSlots.map((time, index) => (
            <div key={index} className="h-12 flex items-start justify-end px-2 text-sm">
              {time}
            </div>
          ))}
        </div>

        {/* Weekdays Columns */}
        {daysOfWeek.map((_, dayIndex) => (
          <div key={dayIndex} className="flex flex-col">
            {timeSlots.map((_, timeIndex) => (
              <div
                key={timeIndex}
                className="min-h-12 p-2 flex flex-col gap-1 items-center w-full border border-gray-300"
              >
                {/* TODO: Dynamic Data from BackEnd */}
                {/* <div className=" bg-pink-300 text-sm py-1 px-2 rounded-md font-semibold w-full text-center">
                  something
                </div> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekBody;
