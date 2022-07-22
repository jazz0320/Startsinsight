import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [pitchData, setPitchData] = useState();
  // useEffect(() => {
  //   fetch(
  //     "https://statsinsight-code-interview.herokuapp.com/get/Get_Balls_CI"
  //   ).then((response) => setPitchData(response.json()));
  // }, []);

  return <div className="App"></div>;
}

export default App;
