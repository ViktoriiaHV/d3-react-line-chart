import "./App.css";
import { useEffect, useState } from "react";

import { LineChart } from "./LineChart";

import { data } from "./data";
import { ChartPoint } from "./ChartPoint";

function App() {
  const [chartData, setChartData] = useState<ChartPoint[]>(data);
  const [colorIdx, setColorIdx] = useState(0);

  const colors = ["#ECF2FF", "#F0EEED", "#F8EAD8", "#FFFBF5"];

  const changeBackgroundColor = () => {
    setColorIdx((prevState) => {
      return colors[prevState + 1] ? prevState + 1 : 0;
    });
  };

  useEffect(() => {
    const fetchData = () => {
      setTimeout(() => {
        setChartData(data);
      }, 1000);
    };
    fetchData();
  });

  return (
    <div className="App">
      <header>
        <h2>Line Chart Using D3 Library</h2>
      </header>
      {chartData && <LineChart data={chartData} color={colors[colorIdx]} />}
      <button
        className="btn"
        style={{ backgroundColor: colors[colorIdx + 1] || colors[0], transition: 'background-color 0.5s ease'}}
        onClick={changeBackgroundColor}
      >
        Change Color
      </button>
    </div>
  );
}

export default App;
