"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageInfo } from "../ProductGallery/ProductGallery";
import { motion } from "framer-motion";

type Props = {
  images: ImageInfo[];
};

const BackdropGallery = ({ images }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => {
    if (currentSlide === images.length - 1) {
      setCurrentSlide(0);
      return;
    }
    setCurrentSlide(currentSlide + 1);
  };

  return (
    <div className="my-12 flex flex-col gap-8">
      <div className="relative ">
        {images.map((img, index) => {
          return (
            <motion.div
              className="top-0"
              style={{
                position: index === 0 ? "relative" : "absolute",
              }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
              }}
              key={index}
              onClick={nextSlide}
            >
              <Image src={img.src} alt={img.alt} width={824} height={644} />
            </motion.div>
          );
        })}
      </div>
      <div className="flex flex-row justify-center gap-4">
        {images.map((img, index) => {
          return (
            <motion.button
              animate={{
                opacity: currentSlide === index ? 1 : 0.8,
              }}
              key={index}
              onClick={() => setCurrentSlide(index)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={100}
                height={(100 * 824) / 644}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BackdropGallery;
