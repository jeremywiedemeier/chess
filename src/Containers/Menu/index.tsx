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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: content.navbar ? "calc(100% - 60px)" : "100%",
        }}
      >
        {content.records ? (
          <div
            style={{
              flex: 1,
              height: content.navbar ? "100%" : "calc(100% - 20px)",
              padding: content.navbar ? "0 5px 0 10px" : "20px 5px 0 10px",
            }}
          >
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
