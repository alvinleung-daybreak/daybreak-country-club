"use client";

import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TennisGame } from "./Game/TennisGame";
import { AssetManager } from "./Game/AssetManager/AssetManager";
import { ImageAsset } from "./Game/AssetManager/ImageAsset";
import { AudioAsset } from "./Game/AssetManager/AudioAsset";
import TennisGameBadge from "./TennisGameBadge";
import { motion, useInView } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";
import useStateRef from "@/hooks/useStateRef";

import Confetti from "react-confetti-boom";
import { useDebounceCallback } from "usehooks-ts";
import PlayerStatPanel from "./PlayerStatPanel";

type Props = {
  onEnterGame: () => void;
  onExitGame: () => void;
};

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

const TennisGameComponent = ({ onEnterGame, onExitGame }: Props) => {
  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;

  const [isGameLoading, setIsGameLoading] = useState(true);
  const [isGameStarted, setIsGameStarted, isGameStartedRef] =
    useStateRef(false);
  const [winner, setWinner] = useState<string | undefined>(undefined);
  const [reason, setWinningReason] = useState<string>("");

  const [isExploding, setIsExploding] = React.useState(false);

  const defaultText = "Challenge the daybreak team";
  const [gameMessageText, setGameMessageText] = useState<string>(defaultText);

  const gameRef = useRef<TennisGame>();

  // const stopExplodingDebounced = useDebounceCallback(() => {
  //   setIsExploding(false);
  // }, 3000);

  const handleWin = (winner: string, reason: string) => {
    if (!isGameStartedRef.current) return;

    setWinner(winner);
    setWinningReason(reason);
    setIsGameStarted(false);

    const winningTexts = [
      "Enjoy your bragging right while you can...",
      "Beginner's luck...",
      "You won't get your way next time",
      "Went easy on you this time...",
    ];
    const losingTexts = [
      "Better luck next time",
      "Tough luck... go for a rematch?",
      "they say third time's the charm...",
      "Caught you on an off day?",
    ];

    if (winner === "player") {
      const randWinningText =
        winningTexts[Math.round(Math.random() * (winningTexts.length - 1))];
      setGameMessageText(randWinningText);
      setIsExploding(true);
    }

    if (winner === "cpu") {
      const randLosingText =
        losingTexts[Math.round(Math.random() * (losingTexts.length - 1))];
      setGameMessageText(randLosingText);
    }
  };

  const handleGameClick = () => {
    setIsGameStarted(true);
    setWinner(undefined);
    setIsExploding(false);

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
      gameRef.current = new TennisGame(canvasRef.current, () => {});
    };
    initGame();

    return () => {};
  }, []);

  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const isInView = useInView(containerRef, {
    amount: 0.5,
    margin: "200% 0px 0px 0px",
  });

  useEffect(() => {
    if (isInView) {
      onEnterGame();
      return;
    }
    onExitGame();
  }, [isInView]);

  return (
    <>
      <div className="absolute left-0 top-0 right-0 flex items-center justify-center z-50">
        {isExploding && (
          <Confetti
            mode="boom"
            x={0.5}
            y={0.1}
            particleCount={50}
            deg={270}
            shapeSize={8}
            spreadDeg={45}
            effectInterval={1000}
            effectCount={10}
            colors={["#ff577f", "#ff884b", "#ffd384", "#fff9b0", "#3498db"]}
          />
        )}
      </div>
      <div
        className="relative w-full max-w-[130vh] mx-4 md:mx-12"
        ref={containerRef}
      >
        <motion.div
          initial={{
            y: 0,
          }}
          animate={{
            y: isInView ? 0 : 0,
            transition: {
              duration: AnimationConfig.VERY_SLOW,
              ease: AnimationConfig.EASING,
            },
          }}
          onClick={handleGameClick}
          className="relative flex max-h-[170vw] h-[80svh] md:h-auto flex-grow items-center bg-forest-green overflow-hidden rounded-[32px] cursor-none"
        >
          <motion.canvas
            animate={{
              opacity: !isInView
                ? 0.05
                : !isGameStarted && winner === undefined
                ? 0.3
                : 1,
              y: isInView ? 0 : 100,
              scale: isInView ? 1 : 1.1,
              rotateX: isInView ? 0 : 50,
              transition: {
                duration: 2,
                ease: AnimationConfig.EASING,
              },
            }}
            ref={canvasRef}
            width={1000}
            height={600}
            className="w-full h-fit scale-150 md:scale-100 touch-none"
          />

          <motion.div
            animate={{
              opacity: !isGameStarted ? 1 : 0,
              transition: {
                delay: isGameStarted ? 0 : 0.6,
              },
            }}
            className="absolute bottom-10 left-0 right-0 flex flex-col items-center z-50 text-chalk-white text-center px-6"
          >
            <div className="font-country-sans-md">{gameMessageText}</div>
            <div className="font-sans-xs opacity-50">
              Click anywhere to start game
            </div>
          </motion.div>
          <div>
            <motion.div
              animate={{
                opacity: isInView && winner === "cpu" ? 1 : 0,
              }}
              className="absolute left-[10%] lg:left-[22%] top-[40%] flex items-center text-chalk-white font-country-script-display"
            >
              Try
            </motion.div>
            <motion.div
              animate={{
                opacity: isInView && winner === "cpu" ? 1 : 0,
              }}
              className="absolute right-[10%] lg:right-[22%] top-[40%] flex items-center text-chalk-white font-country-script-display"
            >
              Again
            </motion.div>
          </div>

          <div>
            <motion.div
              animate={{
                opacity: isInView && winner === "player" ? 1 : 0,
              }}
              className="absolute left-[10%] lg:left-[22%] top-[40%] flex items-center text-chalk-white font-country-script-display"
            >
              You
            </motion.div>
            <motion.div
              animate={{
                opacity: isInView && winner === "player" ? 1 : 0,
              }}
              className="absolute right-[10%] lg:right-[22%] top-[40%] flex items-center text-chalk-white font-country-script-display"
            >
              Won
            </motion.div>
          </div>
          <motion.div
            animate={{
              opacity: isInView ? 1 : 0.1,
            }}
            className="absolute inset-4 bg-transparent border border-chalk-white pointer-events-none rounded-[22px]"
          ></motion.div>
        </motion.div>

        <div className="absolute -top-24 left-0 right-0 flex flex-row">
          <motion.div
            initial={{
              y: 50,
              opacity: 0,
            }}
            animate={{
              y: isInView ? 0 : 50,
              opacity: isInView ? 1 : 0,
              rotate: isInView ? 0 : 10,
              transition: {
                duration: AnimationConfig.SLOW,
                ease: AnimationConfig.EASING,
                delay: 0.3,
              },
            }}
            className="w-[20vw] min-w-48 max-w-72 flex mx-auto z-40"
          >
            <TennisGameBadge />
          </motion.div>
        </div>
        <div className="absolute left-16 right-16 md:left-20 md:right-auto top-20 md:top-8">
          <PlayerStatPanel isGameStarted={isGameStarted} />
        </div>
      </div>
    </>
  );
};

export default TennisGameComponent;
