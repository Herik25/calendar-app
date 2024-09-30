import React, { useEffect, useState } from "react";
import axios from "axios";
import randomColor from "randomcolor";

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

// Convert time (e.g., "00:02") to hours for comparison
const timeToHour = (time) => parseInt(time.split(":")[0], 10);

function WeekBody({ currentDate }) {
  const [appointments, setAppointments] = useState([]);

  const startOfWeek = getStartOfWeek(currentDate); // Use the current date prop

  // Fetch appointments for the current week
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/appointments"
        );

        // Assign a random color to each appointment
        const appointmentsWithColors = response.data.map((appointment) => ({
          ...appointment,
          color: randomColor(), // Assign a random color here
        }));

        setAppointments(appointmentsWithColors);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      }
    };

    fetchAppointments();
  }, [currentDate]);

  // Days of the week array starting from Sunday
  const daysOfWeek = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    return { date: day, formatted: formatDay(day) };
  });

  // Time slots from 00:00 to 23:00
  const timeSlots = [...Array(24).keys()].map((hour) =>
    hour < 10 ? `0${hour}:00` : `${hour}:00`
  );

  // Function to filter appointments for a specific day and time slot
  const getAppointmentsForSlot = (day, hour) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const appointmentStartTime = timeToHour(appointment.startTime);
      const appointmentEndTime = timeToHour(appointment.endTime);

      return (
        appointmentDate.getFullYear() === day.date.getFullYear() &&
        appointmentDate.getMonth() === day.date.getMonth() &&
        appointmentDate.getDate() === day.date.getDate() &&
        hour >= appointmentStartTime &&
        hour < appointmentEndTime // Check if the hour is within the appointment range
      );
    });
  };

  return (
    <div className="p-4">
      {/* Week Header */}
      <div className="grid grid-cols-[1fr_3fr_3fr_3fr_3fr_3fr_3fr_3fr] text-right gap-1 text-lg">
        <div></div>
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day.formatted}</div>
        ))}
      </div>

      {/* Week Grid (24 rows for time slots) */}
      <div className="grid grid-cols-[1fr_3fr_3fr_3fr_3fr_3fr_3fr_3fr]">
        {/* First Column for Time Slots */}
        <div className="flex flex-col">
          {timeSlots.map((time, index) => (
            <div
              key={index}
              className="h-12 flex items-start justify-end px-2 text-sm"
            >
              {time}
            </div>
          ))}
        </div>

        {/* Weekdays Columns */}
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className="flex flex-col">
            {timeSlots.map((time, timeIndex) => {
              const hour = parseInt(time.split(":")[0], 10);
              const appointmentsForSlot = getAppointmentsForSlot(day, hour);

              return (
                <div
                  key={timeIndex}
                  className="min-h-12 p-2 flex flex-col gap-1 items-center w-full border border-gray-300"
                >
                  {/* Render appointments for the current day and time slot */}
                  {appointmentsForSlot.map((appointment, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: appointment.color }} // Use the assigned color
                      className="text-white text-sm py-1 px-2 rounded-md font-semibold w-full"
                    >
                      {appointment.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekBody;
