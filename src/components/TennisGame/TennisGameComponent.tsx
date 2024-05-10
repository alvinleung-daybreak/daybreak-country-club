"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { TennisGame } from "./Game/TennisGame";
import { AssetManager } from "./Game/AssetManager/AssetManager";
import { ImageAsset } from "./Game/AssetManager/ImageAsset";
import { AudioAsset } from "./Game/AssetManager/AudioAsset";
import TennisGameBadge from "./TennisGameBadge";

type Props = {};

/**
 *
 * TODO:
 *
 * - player serve
 * - point score detection
 * - expose game serve API
 * - HTML UI logic
 *
 */

const TennisGameComponent = (props: Props) => {
  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;

  const [isGameLoading, setIsGameLoading] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | undefined>(undefined);
  const [reason, setWinningReason] = useState<string>("");

  const gameRef = useRef<TennisGame>();

  const handleWin = (winner: string, reason: string) => {
    setWinner(winner);
    setWinningReason(reason);
  };

  const handleGameClick = () => {
    setIsGameStarted(true);
    setWinner(undefined);

    if (gameRef.current) {
      gameRef.current.destory();
    }
    gameRef.current = new TennisGame(canvasRef.current, handleWin);
  };

  useEffect(() => {
    const initGame = async () => {
      // load the assets first
      const assets = AssetManager.getInstance();
      assets.add("racket-image", new ImageAsset("./Racket.png"));
      assets.add(
        "ambience-cheer",
        new AudioAsset("./audio-assets/ambience-cheer.mp3")
      );
      assets.add(
        "ambience-combined",
        new AudioAsset("./audio-assets/ambience-combined.mp3")
      );
      assets.add(
        "ambience-nature",
        new AudioAsset("./audio-assets/ambience-nature.mp3")
      );
      assets.add(
        "tennis-hit-1",
        new AudioAsset("./audio-assets/tennis-hit-1.mp3")
      );
      assets.add(
        "tennis-hit-2",
        new AudioAsset("./audio-assets/tennis-hit-2.mp3")
      );
      assets.add(
        "tennis-hit-3",
        new AudioAsset("./audio-assets/tennis-hit-4.mp3")
      );
      assets.add(
        "tennis-strike",
        new AudioAsset("./audio-assets/tennis-hit-3.mp3")
      );
      assets.add("woosh-1", new AudioAsset("./audio-assets/woosh-1.mp3"));
      assets.add("woosh-2", new AudioAsset("./audio-assets/woosh-2.mp3"));
      assets.add("woosh-3", new AudioAsset("./audio-assets/woosh-3.mp3"));
      assets.add("woosh-4", new AudioAsset("./audio-assets/woosh-4.mp3"));

      setIsGameLoading(true);
      await assets.loadAll();
      setIsGameLoading(false);

      // init a game first
      gameRef.current = new TennisGame(canvasRef.current, handleWin);
    };
    initGame();

    return () => {};
  }, []);

  return (
    <div className="relative w-full max-w-[130vh] mx-4 md:mx-12">
      <div
        onClick={handleGameClick}
        className="relative flex flex-grow items-center bg-forest-green overflow-hidden rounded-[32px] cursor-none"
      >
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          className="w-full h-fit"
        />
        {isGameLoading && "loading..."}
        {!isGameStarted && !isGameLoading && (
          <div className="absolute inset-0 flex align-center justify-center h-full">
            Click anywhere to start
          </div>
        )}
        <div className="absolute inset-4 bg-transparent border border-chalk-white pointer-events-none rounded-[22px]"></div>
      </div>
      <div className="absolute -top-24 left-0 right-0 flex flex-row">
        <div className="w-[20vw] min-w-48 max-w-72 flex mx-auto">
          <TennisGameBadge />
        </div>
      </div>
    </div>
  );
};

export default TennisGameComponent;
