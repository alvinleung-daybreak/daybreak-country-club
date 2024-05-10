import useTailwind from "@/hooks/useTailwind";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { AssetManager } from "../TennisGame/Game/AssetManager/AssetManager";
import { AudioAsset } from "../TennisGame/Game/AssetManager/AudioAsset";
import { SizingInfo, SweatshirtProductInfo } from "@/app/SweatshirtProductInfo";

type Props = {
  products: SweatshirtProductInfo[];
  onSelect: (sizeInfo: SizingInfo) => void;
  onClick: () => void;
  currentSize: string; // the name of currentSize
};

const SizeSelector = ({ onSelect, currentSize, onClick, products }: Props) => {
  const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.value as SizingInfo);
  };

  const handleClick = (event: MouseEvent) => {
    onClick();
  };

  return (
    <div
      className={`grid justify-around w-full divide-x border-x h-12`}
      style={{
        gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr)`,
      }}
    >
      {products.map((info, index) => {
        const isCurrent = currentSize === info.size;
        return (
          <div key={index} className="">
            <input
              className="hidden"
              checked={currentSize === info.size}
              onChange={onOptionChange}
              type="radio"
              name="size"
              value={info.size}
              id={info.size}
            />
            <motion.label
              htmlFor={info.size}
              className="font-country-sans-sm font-bold cursor-pointer block pb-2 select-none"
              style={{
                transformOrigin: "bottom center",
                textDecoration: info.stock !== 0 ? "none" : "line-through",
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
              {info.size}
            </motion.label>
          </div>
        );
      })}
    </div>
  );
};

export default SizeSelector;
