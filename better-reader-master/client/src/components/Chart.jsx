import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);
const LineChart = (props) => {
  let values = props.records
    .map((a, b) => {
      return a.pages_read;
    })
    .concat(
      [...Array(7 - props.records.length).keys()].map(() => {
        return 0;
      })
    )
    .reverse();

  const data = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Pages Read",
        data: values,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default LineChart;
