import React from "react";
import { useSelector } from "react-redux";
import { selectGameState } from "../../AppSlice";
import NavBar from "../../Components/NavBar";
import GameRecord from "../../Components/GameRecord";
import "./Menu.css";

const Menu: React.FC<Props> = ({ content }: Props) => {
  const gameState = useSelector(selectGameState);
  return (
    <div id="menu">
      {content.navbar ? <NavBar /> : null}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {content.records ? (
          <div style={{ flex: 1 }}>
            <GameRecord />
          </div>
        ) : null}
        {content.navbar || content.settings || content.gameControls ? (
          <div id="module-wrapper">
            {content.gameControls ? <div>gameControls</div> : null}
            {content.settings ? <div>settings</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
interface Props {
  content: {
    [key: string]: boolean;
  };
}
export default Menu;
