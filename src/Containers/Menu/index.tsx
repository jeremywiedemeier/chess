import React from "react";
import { useSelector } from "react-redux";
import { selectGameState } from "../../AppSlice";
import GameRecord from "../../Components/GameRecord";
import "./Menu.css";

const Menu: React.FC<Props> = ({ content }: Props) => {
  const gameState = useSelector(selectGameState);
  return <div id="menu">{content.records ? <GameRecord /> : null}</div>;
};
interface Props {
  content: {
    [key: string]: boolean;
  };
}
export default Menu;
