import React, { useEffect, useState } from "react";
import axios from "axios";
import randomColor from "randomcolor";
import { Field, FormikProvider, useFormik } from "formik";
import CustomModal from "../Custom/CustomModel"; // Ensure this modal component is implemented
import CustomInput from "../Custom/CustomInput"; // Ensure this input component is implemented

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [draggedAppointment, setDraggedAppointment] = useState(null);

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

  // Handle appointment click for editing
  const handleAppointmentClick = (appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  // Submit updated appointment
  const handleSubmit = async (values, formikHelpers) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointments/${editingAppointment._id}`,
        values
      );
      if (response) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === editingAppointment._id ? { ...appt, ...values } : appt
          )
        );
        setIsModalOpen(false);
        formikHelpers.resetForm();
        setEditingAppointment(null);
      }
    } catch (error) {
      console.error("Error updating appointment: ", error);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!editingAppointment) return; // Prevent if no appointment is selected
    try {
      await axios.delete(
        `http://localhost:5000/api/appointments/${editingAppointment._id}`
      );
      setAppointments((prev) =>
        prev.filter((appt) => appt._id !== editingAppointment._id)
      );
      setIsModalOpen(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error("Error deleting appointment: ", error);
    }
  };

  // Handle drag start
  const handleDragStart = (appointment) => {
    setDraggedAppointment(appointment);
  };

  // Handle drop on a new time slot
  const handleDrop = async (day, time) => {
    if (!draggedAppointment) return;

    const updatedAppointment = {
      ...draggedAppointment,
      date: day.date.toISOString().split("T")[0], // Store the date in ISO format
      startTime: time,
      endTime: timeToHour(time) + 1 + ":00", // Add 1 hour to the end time
    };

    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${draggedAppointment._id}`,
        updatedAppointment
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === draggedAppointment._id ? updatedAppointment : appt
        )
      );
    } catch (error) {
      console.error("Error updating appointment: ", error);
    }

    setDraggedAppointment(null);
  };

  // Initialize Formik for handling the edit form
  const formik = useFormik({
    initialValues: {
      title: editingAppointment ? editingAppointment.title : "",
      date: editingAppointment ? editingAppointment.date : "",
      startTime: editingAppointment ? editingAppointment.startTime : "",
      endTime: editingAppointment ? editingAppointment.endTime : "",
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

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
                  onDragOver={(e) => {
                    e.preventDefault(); // Prevent default to allow drop
                  }}
                  onDrop={() => handleDrop(day, time)}
                >
                  {/* Render appointments for the current day and time slot */}
                  {appointmentsForSlot.map((appointment, i) => (
                    <div
                      key={i}
                      draggable
                      onDragStart={() => handleDragStart(appointment)}
                      style={{ backgroundColor: appointment.color }} // Use the assigned color
                      className="text-white text-sm py-1 px-2 rounded-md font-semibold w-full cursor-pointer"
                      onClick={() => handleAppointmentClick(appointment)} // Handle click to edit
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

      {/* Custom Modal for Editing */}
      {isModalOpen && (
        <CustomModal handleCloseModal={() => setIsModalOpen(false)}>
          <FormikProvider value={formik}>
            <form
              className="p-6 relative"
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <h2 className="text-xl mb-3 font-semibold">Edit Appointment</h2>
              <div className="flex flex-col items-center justify-between gap-4">
                <Field
                  name="title"
                  label="Title"
                  placeholder="Enter Title"
                  required
                  component={CustomInput}
                />
                <Field
                  name="date"
                  label="Date"
                  placeholder="Enter Date"
                  required
                  type="date"
                  component={CustomInput}
                />
                <Field
                  name="startTime"
                  label="Start Time"
                  placeholder="Enter Start Time"
                  type="time"
                  required
                  component={CustomInput}
                />
                <Field
                  name="endTime"
                  label="End Time"
                  placeholder="Enter End Time"
                  type="time"
                  required
                  component={CustomInput}
                />
                <div className="flex items-center justify-between w-full text-sm text-primary font-semibold">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="p-2 bg-red-600 rounded-md text-white"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="p-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="p-2 bg-green-600 rounded-md text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </FormikProvider>
        </CustomModal>
      )}
    </div>
  );
}

export default WeekBody;
