"use client";

import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

type Props = { isGameStarted: boolean };

const cpuPlayers = [
  { name: "Taha Hossain", title: "CEO" },
  { name: "Ross Chan", title: "Illustrator/Animator" },
  { name: "Aliasger Rasheed", title: "Brand Designer" },
  { name: "Tracy Chen", title: "Senior Product Designer" },
  { name: "Kiran Patel", title: "Designer/Developer" },
  { name: "Maanav Sunderaraman", title: "Operations + Strategy" },
  { name: "Khadija Bari", title: "Product Designer" },
  { name: "Ben Giannis", title: "Designer/Developer" },
  { name: "Edwin Tran", title: "Brand Designer" },
  { name: "Christopher Ha", title: "Developer" },
  { name: "Rafi Rizky", title: "Animator" },
  { name: "Alvin Leung", title: "Designer/Developer" },
  { name: "Ryan Hunt", title: "Senior Brand Designer" },
  { name: "Jenny Rudziensky", title: "Senior Brand Designer" },
];

const PlayerStatPanel = ({ isGameStarted }: Props) => {
  const [randomPlayer, setRandomPlayer] = useState<
    { name: string; title: string } | undefined
  >(undefined);

  useEffect(() => {
    if (isGameStarted) {
      setRandomPlayer(
        cpuPlayers[Math.round(Math.random() * (cpuPlayers.length - 1))]
      );
    }
  }, [isGameStarted]);

  return (
    randomPlayer && (
      <>
        <RibbonLeft />
        <RibbonRight />
        <motion.div
          className="relative bg-[#134F34] text-chalk-white px-2 py-1 border border-black divide-y divide-black flex flex-col z-20 shadow-lg"
          animate={{
            opacity: randomPlayer ? 1 : 0,
          }}
        >
          <div className="flex flex-row pb-1">
            <div className="font-country-sans-sm mr-3 w-6">P1</div>
            <div className="font-country-sans-sm">You</div>
          </div>
          <div className="flex flex-row pt-1">
            <div className="font-country-sans-sm mr-3 w-6">P2</div>
            <div>
              <div className="font-country-sans-sm">{randomPlayer.name}</div>
              <div className="font-sans-xs opacity-50">
                {randomPlayer.title}
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )
  );
};

const RibbonRight = () => (
  <svg
    className="absolute -right-6 bottom-0 z-0"
    width="64"
    height="52"
    viewBox="0 0 64 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M64 0H0V52H64L48 26L64 0Z" fill="#134F34" />
  </svg>
);

const RibbonLeft = () => (
  <svg
    className="absolute -left-6 bottom-0 z-0"
    width="64"
    height="52"
    viewBox="0 0 64 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0H64V52H0L16 26L0 0Z" fill="#134F34" />
  </svg>
);

export default PlayerStatPanel;
