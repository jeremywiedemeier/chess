import React from "react";
import { useSelector } from "react-redux";
import { selectGameState } from "../../AppSlice";
import NavBar from "../../Components/NavBar";
import GameRecord from "../../Components/GameRecord";
import GameControls from "../../Components/GameControls";
import "./Menu.css";

const Menu: React.FC<Props> = ({ content }: Props) => {
  const gameState = useSelector(selectGameState);
  return (
    <div id="menu">
      {content.navbar ? <NavBar /> : null}
      {content.gameControls ? (
        <GameControls gameState={gameState} verticalLayout={content.records} />
      ) : null}
      {content.engine ? <div>engine</div> : null}
      {content.records ? <GameRecord gameState={gameState} /> : null}
    </div>
  );
};
interface Props {
  content: {
    [key: string]: boolean;
  };
}
export default Menu;
