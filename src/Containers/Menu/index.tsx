import React from "react";
import { useSelector } from "react-redux";
import { selectGameState } from "../../AppSlice";
import NavBar from "../../Components/NavBar";
import GameRecord from "../../Components/GameRecord";
import GameControls from "../../Components/GameControls";
import Score from "../../Components/Score";
import EngineSettings from "../../Components/EngineSettings";
import EngineLogs from "../../Components/EngineLogs";
import "./Menu.css";

const Menu: React.FC<Props> = ({ content }: Props) => {
  const gameState = useSelector(selectGameState);
  return (
    <div id="menu">
      {content.navbar ? <NavBar /> : null}
      {content.gameControls ? <GameControls gameState={gameState} /> : null}
      {content.engine ? <EngineSettings gameState={gameState} /> : null}
      {content.score ? <Score score={gameState.score} /> : null}
      {content.engineLogs ? (
        <EngineLogs engineLogs={gameState.engineLogs} />
      ) : null}
      {content.records ? (
        <GameRecord gameState={gameState} shorten={content.navbar} />
      ) : null}
    </div>
  );
};
interface Props {
  content: {
    navbar: boolean;
    gameControls: boolean;
    engine: boolean;
    score: boolean;
    engineLogs: boolean;
    records: boolean;
  };
}
export default Menu;
