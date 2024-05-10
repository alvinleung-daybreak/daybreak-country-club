"use client";

import TennisGameComponent from "@/components/TennisGame/TennisGameComponent.1";
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
