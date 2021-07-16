import React from "react";
import "./Classifier.css";

const Classifier: React.FC = () => {
  return (
    <div id="classifier">
      <h3 className="module-title">Human Classifier</h3>
      <div id="classifier-scale-wrapper">
        <img alt="robot" className="robot" src="robot2.png" />
        <div id="classifier-scale">
          <div
            id="scale-data"
            style={{
              transform: `translateX(100%) scaleX(${
                100 * (2 * Math.random() - 1)
              }%)`,
            }}
          />
        </div>
        <img alt="human" src="human.png" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50%",
        }}
      >
        <button
          type="button"
          id="analyze-button"
          onClick={() => {
            console.log("eyy");
          }}
        >
          Analyze
        </button>
      </div>
    </div>
  );
};

export default Classifier;
