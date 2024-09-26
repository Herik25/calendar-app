import React from "react";
import Header from "./Components/Header";
import MonthBody from "./Components/MonthBody";
import WeekBody from "./Components/WeekBody";

function App() {
  return (
    <div className=" font-sans">
      <Header />
      {/* <MonthBody /> */}
      <WeekBody />
    </div>
  );
}

export default App;
