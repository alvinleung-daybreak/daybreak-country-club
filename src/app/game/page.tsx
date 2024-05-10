import TennisGameComponent from "@/components/TennisGame/TennisGameComponent";
import React from "react";

type Props = {};

const GamePage = (props: Props) => {
  return (
    <div>
      <TennisGameComponent onEnterGame={() => {}} onExitGame={() => {}} />
    </div>
  );
};

export default GamePage;
