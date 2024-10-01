import React, { useEffect, useState } from "react";
import axios from "axios";
import randomColor from "randomcolor";
import { Field, FormikProvider, useFormik } from "formik";
import CustomModal from "../Custom/CustomModel"; // Ensure this modal component is implemented
import CustomInput from "../Custom/CustomInput"; // Ensure this input component is implemented

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

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
        alert("Failed to fetch appointments. Please try again later."); // User feedback
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

  // Handle drag and drop
  const handleDragStart = (e, appointment) => {
    e.dataTransfer.setData("appointmentId", appointment._id);
  };

  const handleDrop = async (e, hour) => {
    e.preventDefault();
    const appointmentId = e.dataTransfer.getData("appointmentId");
    const draggedAppointment = appointments.find(
      (appt) => appt._id === appointmentId
    );

    if (draggedAppointment) {
      // Update the appointment in the state
      const updatedAppointment = {
        ...draggedAppointment,
        endTime: `${hour + 1}:00`, // Update end time to the next hour
      };

      try {
        // Send a PUT request to update the appointment in the database
        await axios.put(
          `http://localhost:5000/api/appointments/${appointmentId}`,
          {
            title: updatedAppointment.title,
            date: updatedAppointment.date,
            startTime: updatedAppointment.startTime,
            endTime: updatedAppointment.endTime,
          }
        );

        // Update the state to reflect the changes
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === appointmentId ? updatedAppointment : appt
          )
        );
      } catch (error) {
        console.error("Error updating appointment: ", error);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
                onDrop={(e) => handleDrop(e, hour)}
                onDragOver={handleDragOver}
              >
                {/* Render appointments for the current hour */}
                {appointmentsForHour.map((appointment, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={(e) => handleDragStart(e, appointment)} // Handle drag start
                    style={{ backgroundColor: appointment.color }} // Use the assigned color
                    className="text-sm text-white py-1 px-2 rounded-md font-semibold w-full cursor-pointer"
                    onClick={() => handleAppointmentClick(appointment)} // Handle click to edit
                  >
                    {appointment.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
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
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 bg-gray-600 rounded-md text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="p-2 bg-blue-600 rounded-md text-white"
                    >
                      Update
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

export default DayBody;
