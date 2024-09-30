import React, { useState } from "react";
import Header from "./Components/Header";
import MonthBody from "./Components/MonthBody";
import WeekBody from "./Components/WeekBody";
import DayBody from "./Components/DayBody";
import { MdOutlineClose } from "react-icons/md";
import { RiAlertFill } from "react-icons/ri";
import CustomModal from "./Components/Custom/CustomModel";
import { Field, FormikProvider, useFormik } from "formik";
import CustomInput from "./Components/Custom/CustomInput";

function App() {
  const date = new Date();
  const currentMonth = date.getMonth();
  const currentDay = date.getDay();
  const [showBody, setShowBody] = useState("month");
  const [month, setMonth] = useState(currentMonth);
  const [day, setDay] = useState(currentDay);
  // week prev and next
  const [currentDate, setCurrentDate] = useState(new Date());
  // custom model
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goToNextWeek = () => {
    setCurrentDate((prevDate) => {
      const nextWeek = new Date(prevDate);
      nextWeek.setDate(prevDate.getDate() + 7);
      return nextWeek;
    });
  };

  const goToPreviousWeek = () => {
    setCurrentDate((prevDate) => {
      const previousWeek = new Date(prevDate);
      previousWeek.setDate(prevDate.getDate() - 7);
      return previousWeek;
    });
  };

  // custom model

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // handle form submit

  const handleSubmit = (values, formikHelpers) => {
    console.log(values);
  };

  const formik = useFormik({
    // validationSchema: schema,
    onSubmit: (values, formikHelpers) => handleSubmit(values, formikHelpers),
    initialValues: {
      title: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  });

  return (
    <div className=" font-sans">
      <Header
        showBody={showBody}
        setShowBody={setShowBody}
        month={month}
        setMonth={setMonth}
        day={day}
        setDay={setDay}
        goToPreviousWeek={goToPreviousWeek}
        goToNextWeek={goToNextWeek}
        handleOpenModal={handleOpenModal}
      />
      {showBody === "month" && <MonthBody month={month} />}
      {showBody === "week" && <WeekBody currentDate={currentDate} />}
      {showBody === "day" && <DayBody day={day} />}
      {isModalOpen && (
        <CustomModal handleCloseModal={handleCloseModal}>
          <FormikProvider value={formik}>
            <form
              className="p-6 relative"
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <h2 className=" text-xl mb-3 font-semibold">Add Appointment</h2>
              <div className=" flex flex-col items-center justify-between gap-4">
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
                <div className=" flex items-center justify-end w-full gap-3 text-xs text-primary font-semibold">
                  <button className=" p-2" onClick={() => handleCloseModal()}>
                    cancle
                  </button>
                  <button className=" p-2">Add Appointment</button>
                </div>
              </div>
            </form>
          </FormikProvider>
        </CustomModal>
      )}
    </div>
  );
}

export default App;
