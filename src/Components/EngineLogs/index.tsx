import React, { useEffect } from "react";
import "./EngineLogs.css";

const EngineLogs: React.FC<Props> = ({ engineLogs }: Props) => {
  useEffect(() => {
    document
      .querySelector("#engine-logs p:last-child")
      ?.scrollIntoView({ block: "end" });
  });

  return (
    <div id="engine-logs">
      {engineLogs.map((log, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <p key={i + log}>&gt; {log}</p>
      ))}
      <p>
        &gt; <span className="blinking">_</span>
      </p>
      <p> </p>
    </div>
  );
};

interface Props {
  engineLogs: string[];
}

export default EngineLogs;
