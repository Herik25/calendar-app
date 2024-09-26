import React from "react";
import Header from "./Components/Header";
import MonthBody from "./Components/MonthBody";
import WeekBody from "./Components/WeekBody";
import DayBody from "./Components/DayBody";

function App() {
  return (
    <div className=" font-sans">
      <Header />
      {/* <MonthBody /> */}
      {/* <WeekBody /> */}
      <DayBody />
    </div>
  );
}

export default App;
