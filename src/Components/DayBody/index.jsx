import React, { useEffect, useState } from "react";
import axios from "axios";
import randomColor from "randomcolor";

// Helper function to generate time slots from 00:00 to 23:00
const generateTimeSlots = () =>
  [...Array(24).keys()].map((hour) =>
    hour < 10 ? `0${hour}:00` : `${hour}:00`
  );

function DayBody({ day }) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timeSlots = generateTimeSlots();
  const currentDay = daysOfWeek[day]; // Get the current day

  const [appointments, setAppointments] = useState([]);

  // Fetch appointments for the current day
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
  }, [day]);

  // Function to filter appointments for the current day and time slot
  const getAppointmentsForHour = (hour) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const appointmentStartTime = parseInt(
        appointment.startTime.split(":")[0],
        10
      );
      const appointmentEndTime = parseInt(
        appointment.endTime.split(":")[0],
        10
      );

      return (
        appointmentDate.getDay() === day && // Check if the appointment is on the selected day
        hour >= appointmentStartTime &&
        hour < appointmentEndTime // Check if the hour is within the appointment range
      );
    });
  };

  return (
    <div className="p-4">
      {/* Day Header */}
      <div className="font-bold text-base m-2">{currentDay}</div>

      {/* Day Grid (24 rows for time slots) */}
      <div className="grid grid-cols-[0.5fr_9.5fr]">
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
          {timeSlots.map((time, index) => {
            const hour = parseInt(time.split(":")[0], 10);
            const appointmentsForHour = getAppointmentsForHour(hour);

            return (
              <div
                key={index}
                className="min-h-16 flex flex-col gap-1 items-center p-2 border border-gray-300"
              >
                {/* Render appointments for the current hour */}
                {appointmentsForHour.map((appointment, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: appointment.color }} // Use the assigned color
                    className="text-sm  text-white py-1 px-2 rounded-md font-semibold w-full"
                  >
                    {appointment.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DayBody;
