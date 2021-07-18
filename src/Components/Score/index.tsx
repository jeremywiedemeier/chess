import React from "react";
import { Line } from "react-chartjs-2";
import "./Score.css";

const Score: React.FC<Props> = ({ score }: Props) => {
  return (
    <div id="score">
      <h3 className="module-title">Evaluation</h3>

      <div id="chart-wrapper">
        <Line
          type="line"
          data={{
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: [
              {
                label: "Score",
                data: score
                  .slice(-11)
                  .map((val) => Math.min(Math.max(val / 30, -10), 10)),
                borderColor: "#b68d6e",
                radius: 0,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
              annotation: {
                annotations: [
                  {
                    type: "line",
                    scaleID: "y",
                    borderWidth: 3,
                    borderColor: "black",
                    value: 3,
                  },
                ],
              },
            },
            animation: { duration: 0 },
            elements: { line: { tension: 0 } },
            scales: {
              y: {
                display: false,
                min: -11,
                max: 11,
                id: "y",
              },
              x: {
                display: false,
              },
            },
          }}
        />
        <div id="chart-midline" />
      </div>
      <div id="score-scale-wrapper">
        <img alt="human" src="human.png" />
        <div id="score-scale">
          <div
            id="scale-data"
            style={{
              transform: `translateX(100%) scaleX(${Math.min(
                Math.max((score.slice(-1)[0] || 0) / 5, -100),
                100
              )}%)`,
            }}
          />
        </div>
        <img alt="robot" className="robot" src="robot2.png" />
      </div>
    </div>
  );
};

interface Props {
  score: number[];
}

export default Score;
