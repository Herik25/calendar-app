import React, { useState } from "react";
import Header from "./Components/Header";
import MonthBody from "./Components/MonthBody";
import WeekBody from "./Components/WeekBody";
import DayBody from "./Components/DayBody";

function App() {
  const date = new Date();
  const currentMonth = date.getMonth();
  const currentDay = date.getDay();
  const [showBody, setShowBody] = useState("month");
  const [month, setMonth] = useState(currentMonth);
  const [day, setDay] = useState(currentDay);
  // State to hold the current date (week)
  const [currentDate, setCurrentDate] = useState(new Date());

  // Function to move to the next week
  const goToNextWeek = () => {
    setCurrentDate((prevDate) => {
      const nextWeek = new Date(prevDate);
      nextWeek.setDate(prevDate.getDate() + 7); // Move forward by 7 days
      return nextWeek;
    });
  };

  // Function to move to the previous week
  const goToPreviousWeek = () => {
    setCurrentDate((prevDate) => {
      const previousWeek = new Date(prevDate);
      previousWeek.setDate(prevDate.getDate() - 7); // Move back by 7 days
      return previousWeek;
    });
  };
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
      />
      {showBody === "month" && <MonthBody month={month} />}
      {showBody === "week" && <WeekBody currentDate={currentDate} />}
      {showBody === "day" && <DayBody day={day} />}
    </div>
  );
}

export default App;
