import useTailwind from "@/hooks/useTailwind";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { AssetManager } from "../TennisGame/Game/AssetManager/AssetManager";
import { AudioAsset } from "../TennisGame/Game/AssetManager/AudioAsset";

export type SizeInfo = {
  name: string;
  isAvailable: boolean;
};

type Props = {
  sizeInfos: SizeInfo[];
  onSelect: (sizeInfo: string) => void;
  onClick: () => void;
  currentSize: string; // the name of currentSize
};

const SizeSelector = ({ onSelect, currentSize, onClick, sizeInfos }: Props) => {
  const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.value);
  };

  const handleClick = (event: MouseEvent) => {
    onClick();
  };

  return (
    <div
      className={`grid justify-around w-full divide-x border-x`}
      style={{
        gridTemplateColumns: `repeat(${sizeInfos.length}, minmax(0, 1fr)`,
      }}
    >
      {sizeInfos.map((info, index) => {
        const isCurrent = currentSize === info.name;
        return (
          <div key={index} className="">
            <input
              className="hidden"
              checked={currentSize === info.name}
              onChange={onOptionChange}
              type="radio"
              name="size"
              value={info.name}
              id={info.name}
            />
            <motion.label
              htmlFor={info.name}
              className="font-country-sans-sm font-bold cursor-pointer block pb-2 select-none"
              style={{
                transformOrigin: "bottom center",
              }}
              animate={{
                color: isCurrent ? "#D4FF00" : "#FFFCF2",
              }}
              whileTap={{
                scale: 0.7,
              }}
              onTap={handleClick}
            >
              <div className="h-2 mb-2 w-full flex items-center justify-center">
                <motion.div
                  className="w-2 h-2 bg-melton-yellow rounded-full"
                  initial={{
                    y: isCurrent ? 0 : 10,
                    opacity: isCurrent ? 1 : 0,
                  }}
                  animate={{
                    y: isCurrent ? 0 : 10,
                    opacity: isCurrent ? 1 : 0,
                    transition: {
                      type: isCurrent ? "spring" : "tween",
                      stiffness: 400,
                      damping: 10,
                      ease: "easeIn",
                      duration: 0.3,
                    },
                  }}
                />
              </div>
              {info.name}
            </motion.label>
          </div>
        );
      })}
    </div>
  );
};

export default SizeSelector;
