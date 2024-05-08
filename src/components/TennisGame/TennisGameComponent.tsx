"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { TennisGame } from "./Game/TennisGame";
import { AssetManager } from "./Game/AssetManager/AssetManager";
import { ImageAsset } from "./Game/AssetManager/ImageAsset";
import { AudioAsset } from "./Game/AssetManager/AudioAsset";

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

  const gameRef = useRef<TennisGame>();
  const handleGameClick = () => {
    setIsGameStarted(true);

    if (gameRef.current) {
      gameRef.current.destory();
    }
    gameRef.current = new TennisGame(canvasRef.current);
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
    };
    initGame();

    return () => {};
  }, []);

  return (
    <div onClick={handleGameClick} className="relative ">
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        className="cursor-none"
      />
      {isGameLoading && "loading..."}
      {!isGameStarted && !isGameLoading && (
        <div className="absolute inset-0 flex align-center justify-center h-full">
          Click anywhere to start
        </div>
      )}
    </div>
  );
};

export default TennisGameComponent;
