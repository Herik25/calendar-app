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
  const [currentDate, setCurrentDate] = useState(new Date());

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
