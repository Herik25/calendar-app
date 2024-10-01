import React, { useEffect, useState } from "react";
import axios from "axios";
import randomColor from "randomcolor";
import { Field, FormikProvider, useFormik } from "formik";
import CustomModal from "../Custom/CustomModel"; // Ensure this modal component is implemented
import CustomInput from "../Custom/CustomInput"; // Ensure this input component is implemented

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
  const currentMonth = month;

  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Days of the week array starting with Sunday
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

  // Fetch appointments for the current month
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/appointments"
        );
        const appointmentsWithColors = response.data.map((appointment) => ({
          ...appointment,
          color: randomColor(),
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

  // Create an array for the days of the calendar
  const daysArray = [];
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDayOfMonth(currentYear, currentMonth);

  // Fill calendar days with previous, current, and next month
  const daysInPreviousMonth = getDaysInMonth(
    currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );
  for (let i = startDay - 1; i >= 0; i--) {
    daysArray.push({ day: daysInPreviousMonth - i, currentMonth: false });
  }
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    daysArray.push({ day: i, currentMonth: true });
  }
  const totalCells = 42;
  const remainingCells = totalCells - daysArray.length;
  for (let i = 1; i <= remainingCells; i++) {
    daysArray.push({ day: i, currentMonth: false });
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
              getAppointmentsForDay(dayObj.day).map((appointment, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: appointment.color }} // Use the assigned color
                  className="text-sm py-1 px-2 rounded-md font-semibold text-white cursor-pointer"
                  onClick={() => handleAppointmentClick(appointment)} // Handle click to edit
                >
                  {appointment.title}
                </div>
              ))}
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
                    <button type="submit" className="p-2">
                      Save Changes
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

export default MonthBody;
