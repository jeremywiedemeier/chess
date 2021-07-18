import React from "react";
import "./NavBar.css";

const NavBar: React.FC = () => {
  return (
    <div id="navbar">
      <a href="https://jeremywiedemeier.com/">
        <button type="button" tabIndex={-1}>
          <img
            src="home.png"
            alt="home"
            style={{ margin: "3px 0 0 0", height: "32px", width: "32px" }}
          />
          <span>Home</span>
        </button>
      </a>
      <a
        href="https://github.com/jeremywiedemeier/chess"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button type="button" tabIndex={-1}>
          <img src="code.png" alt="code" />
          <span>Code</span>
        </button>
      </a>
      <a
        href="https://github.com/thomasahle/sunfish"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button type="button" tabIndex={-1}>
          <img src="brain.png" alt="brain" />
          <span>Engine</span>
        </button>
      </a>
      <button type="button">
        <img
          src="bulb.png"
          style={{ margin: "3px 0 0 0", height: "32px", width: "32px" }}
          alt="bulb"
        />
      </button>
    </div>
  );
};

export default NavBar;
