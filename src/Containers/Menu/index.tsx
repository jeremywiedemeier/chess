import React from "react";
import "./Menu.css";

const Menu: React.FC<Props> = ({ content }: Props) => {
  return (
    <div id="menu">
      {/* <img alt="Change time" src="clock.png" />
      <img alt="Reset game" src="reset.png" />
      <img alt="Randomize side" src="sides.png" /> */}
    </div>
  );
};
interface Props {
  content: {
    [key: string]: boolean;
  };
}
export default Menu;
