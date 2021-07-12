import React from "react";
import "./NavBar.css";

const NavBar: React.FC = () => {
  return (
    <div id="navbar">
      <button type="button">Home</button>
      <button type="button">About</button>
      <button
        type="button"
        onClick={() => {
          window.open("https://github.com/jeremywiedemeier/chess");
        }}
      >
        Code
      </button>
      <button
        type="button"
        onClick={() => {
          window.open("https://github.com/thomasahle/sunfish");
        }}
      >
        Engine
      </button>
    </div>
  );
};

export default NavBar;
