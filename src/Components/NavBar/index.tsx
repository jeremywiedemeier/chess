import React from "react";
import "./NavBar.css";
import { useDispatch } from "react-redux";
import brain from "./brain.png";
import bulb from "./bulb.png";
import code from "./code.png";
import home from "./home.png";
import { toggleTheme } from "../../AppSlice";

const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <div id="navbar">
      <a href="https://jeremywiedemeier.com/">
        <button type="button" tabIndex={-1}>
          <img
            src={home}
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
          <img src={code} alt="code" />
          <span>Code</span>
        </button>
      </a>
      <a
        href="https://github.com/thomasahle/sunfish"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button type="button" tabIndex={-1}>
          <img src={brain} alt="brain" />
          <span>Engine</span>
        </button>
      </a>
      <button
        type="button"
        onClick={() => {
          const lightSwitch = document.getElementById(
            "light-switch"
          ) as HTMLAudioElement;
          if (lightSwitch) {
            lightSwitch.volume = 0.7;
            lightSwitch.play();
          }
          dispatch(toggleTheme());
        }}
      >
        <img
          src={bulb}
          style={{ margin: "3px 0 0 0", height: "32px", width: "32px" }}
          alt="bulb"
        />
      </button>
    </div>
  );
};

export default NavBar;
