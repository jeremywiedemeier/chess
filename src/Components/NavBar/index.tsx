import React from "react";
import "./NavBar.css";

const NavBar: React.FC = () => {
  return (
    <div id="navbar">
      <a href="https://jeremywiedemeier.com/">
        <button type="button">Home</button>
      </a>
      <a
        href="https://github.com/jeremywiedemeier/chess"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button type="button" className="dark">
          Code
        </button>
      </a>
      <a
        href="https://github.com/thomasahle/sunfish"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button type="button">Sunfish</button>
      </a>
    </div>
  );
};

export default NavBar;
