import { AnimationConfig } from "@/components/AnimationConfig";
import StackGallery from "@/components/StackGallery/StackGallery";
import { motion, useInView } from "framer-motion";
import React, { MutableRefObject, useRef } from "react";

type Props = {};

const btsImages = [
  {
    src: "/country-club/bts-gallery/IMG_0007.jpg",
    alt: "Behind the seen look 1",
  },
  {
    src: "/country-club/bts-gallery/IMG_0016.jpg",
    alt: "Behind the seen look 2",
  },
  {
    src: "/country-club/bts-gallery/IMG_8153.jpg",
    alt: "Behind the seen look",
  },
  {
    src: "/country-club/bts-gallery/IMG_8156.jpg",
    alt: "Behind the seen look",
  },
  {
    src: "/country-club/bts-gallery/IMG_9311.jpg",
    alt: "Behind the seen look",
  },
  {
    src: "/country-club/bts-gallery/IMG_9397.jpg",
    alt: "Behind the seen look",
  },
  {
    src: "/country-club/bts-gallery/IMG_9408.jpg",
    alt: "Behind the seen look",
  },
];

const BTSSection = (props: Props) => {
  const containerRef = useRef() as MutableRefObject<HTMLElement>;
  const isInView = useInView(containerRef, {
    margin: "-0% 0% 0% 0%",
    amount: 0.3,
  });

  return (
    <section className="flex flex-col items-center my-24" ref={containerRef}>
      <motion.small
        className="font-country-sans-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isInView ? 1 : 0,
          transition: {
            duration: AnimationConfig.SLOW,
            delay: 0,
          },
        }}
      >
        Behind the scenes
      </motion.small>
      <motion.h2
        className="font-country-script-display mb-12 text-center"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isInView ? 1 : 0,
          transition: {
            duration: AnimationConfig.SLOW,
            delay: 0.1,
          },
        }}
      >
        Country club photoshoot & ephemera
      </motion.h2>
      <div className="flex flex-col md:flex-row max-w-[70ch] text-justify gap-4 mx-4">
        <motion.p
          className="font-sans-sm max-w-[34ch]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isInView ? 1 : 0,
            transition: {
              duration: AnimationConfig.SLOW,
              delay: 0.2,
            },
          }}
        >
          As the project unfolded over time and expanded beyond the initial
          commemorative sweatshirt, we ended up art directing amx-4 photoshoot
          in our very own studio as well as creating and amassing a variety of
          Country Club artefacts.
        </motion.p>
        <motion.p
          className="font-sans-sm max-w-[34ch]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isInView ? 1 : 0,
            transition: {
              duration: AnimationConfig.SLOW,
              delay: 0.25,
            },
          }}
        >
          Take an inside look into the behind-the-scenes of our Country Club
          campaign—from sourcing props like our vintage tennis racquets and ball
          hopper to designing custom clothing tags, intricate wax seals, and
          rubber-stamped logos.
        </motion.p>
      </div>
      <StackGallery images={btsImages} />
    </section>
  );
};

export default BTSSection;
