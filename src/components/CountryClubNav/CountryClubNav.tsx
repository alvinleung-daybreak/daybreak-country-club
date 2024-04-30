"use client";

import React, { useState } from "react";
import { CountryClubLogo } from "./CountryClubLogo";
import { motion } from "framer-motion";

type Props = {};

const CountryClubNav = (props: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="h-16"></div>
      <nav className="fixed top-0 left-0 right-0 mx-4 md:mx-12 h-16 border-l border-r border-b flex flex-row items-center justify-center z-10 bg-forest-green">
        <CountryClubLogo />
        <div className="absolute right-0 px-4">
          <button
            className="font-cond-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Close" : "Menu"}
          </button>
        </div>
        <motion.div
          initial={{
            height: 0,
          }}
          animate={{
            height: isExpanded ? "auto" : 0,
          }}
          className="absolute z-10 top-[100%] w-full overflow-hidden border-b"
        >
          <div className="py-8 flex flex-col items-center gap-4 bg-forest-green">
            <a className="font-cond-sm" href="https://www.daybreak.studio">
              Back to studio
            </a>
            <a
              className="font-cond-sm"
              href="https://www.instagram.com/daybreakstudio/"
            >
              Instagram
            </a>
            <a
              className="font-cond-sm"
              href="https://twitter.com/madebydaybreak"
            >
              Twitter
            </a>
          </div>
        </motion.div>
      </nav>
    </>
  );
};

export default CountryClubNav;
