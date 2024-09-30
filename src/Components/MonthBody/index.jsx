import React, { useEffect, useState } from "react";
import axios from "axios";
import randomColor from "randomcolor";

// Helper function to get the number of days in a given month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get the day of the week for the 1st day of the month
const getStartDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay(); // Sunday = 0, Monday = 1, etc.
};

function MonthBody({ month }) {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = month; // For testing, you can set a specific month, e.g., 8 for September

  const [appointments, setAppointments] = useState([]);

  // Days of the week array starting with Sunday
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDayOfMonth(currentYear, currentMonth); // Start day for the current month

  // Previous month calculations
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // If current month is January, previous month is December
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPreviousMonth = getDaysInMonth(previousMonthYear, previousMonth);

  // Fetch appointments for the current month
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
  }, [currentMonth]);

  // Filter appointments for the current month
  const getAppointmentsForDay = (day) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getFullYear() === currentYear &&
        appointmentDate.getMonth() === currentMonth &&
        appointmentDate.getDate() === day
      );
    });
  };

  // Create an array for the days of the calendar
  const daysArray = [];

  // Add dates from the previous month for the empty slots before the 1st of the current month
  for (let i = startDay - 1; i >= 0; i--) {
    daysArray.push({
      day: daysInPreviousMonth - i, // Filling the days from the end of the previous month
      currentMonth: false, // Indicate that this date is from the previous month
    });
  }

  // Add the actual days of the current month
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    daysArray.push({
      day: i,
      currentMonth: true,
    });
  }

  // Add dates from the next month to fill out the remaining grid cells
  const totalCells = 42; // 6 rows * 7 days per week = 42 cells
  const remainingCells = totalCells - daysArray.length;
  for (let i = 1; i <= remainingCells; i++) {
    daysArray.push({
      day: i,
      currentMonth: false, // Indicate that this date is from the next month
    });
  }

  return (
    <div className="p-4">
      {/* Days of the Week */}
      <div className="grid grid-cols-7 text-right gap-1 text-lg">
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 w-full">
        {daysArray.map((dayObj, index) => (
          <div
            key={index}
            className={`h-40 border border-gray-300 p-2 flex flex-col gap-1 ${
              dayObj.currentMonth ? "bg-white" : "bg-gray-100 text-gray-400"
            }`}
          >
            <div className="text-right text-xl">{dayObj.day}</div>

            {/* Render appointments for the current day */}
            {dayObj.currentMonth &&
              getAppointmentsForDay(dayObj.day).map((appointment, i) => {
                return (
                  <div
                    key={i}
                    style={{ backgroundColor: appointment.color }} // Use the assigned color
                    className="text-sm py-1 px-2 rounded-md font-semibold text-white"
                  >
                    {appointment.title}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthBody;
