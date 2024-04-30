"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { breakpoints, useBreakpoint } from "@/hooks/useBreakpoints";
import Carousel, { useCarouselControls } from "../Carousel/Carousel";
import { AssetManager } from "../TennisGame/Game/AssetManager/AssetManager";
import { AudioAsset } from "../TennisGame/Game/AssetManager/AudioAsset";
import { SoundEffect } from "../TennisGame/Game/SoundEffect";
import { motion } from "framer-motion";

export type ImageInfo = {
  src: string;
  alt: string;
};

type Props = {
  images: ImageInfo[];
};

const ProductGallery = ({ images }: Props) => {
  const isDesktop = useBreakpoint(breakpoints.md);

  return (
    <div className="flex w-full flex-col overflow-hidden">
      {!isDesktop && <MobileCarousel images={images} />}
      {isDesktop &&
        images.map(({ src, alt }, index) => (
          <div key={index}>
            <Image
              className="w-full"
              src={src}
              alt={alt}
              width={1080}
              height={1080}
            />
          </div>
        ))}
    </div>
  );
};

const MobileCarousel = ({ images }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const wooshSoundEffect = useRef<SoundEffect>();

  useEffect(() => {
    const loadAssets = async () => {
      const assets = AssetManager.getInstance();

      assets.add("woosh-1", new AudioAsset("./audio-assets/woosh-1.mp3"));
      assets.add("woosh-2", new AudioAsset("./audio-assets/woosh-2.mp3"));
      assets.add("woosh-3", new AudioAsset("./audio-assets/woosh-3.mp3"));
      await assets.loadAll();
      wooshSoundEffect.current = new SoundEffect([
        assets.get("woosh-1"),
        assets.get("woosh-2"),
        assets.get("woosh-3"),
      ]);
    };
    loadAssets();
  }, []);

  useEffect(() => {
    wooshSoundEffect.current?.trigger();
  }, [currentSlide, wooshSoundEffect]);

  const indicatorsArr = useMemo(
    () => [...Array(images.length)],
    [images.length]
  );

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Carousel onSlideChange={setCurrentSlide}>
        {images.map(({ src, alt }, index) => (
          <ProductCarouselItem key={index} src={src} alt={alt} />
        ))}
      </Carousel>
      <div className="absolute bottom-0 w-full pb-4 flex flex-row items-center justify-center gap-4">
        {indicatorsArr.map((_, index) => (
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{
              opacity: index === currentSlide ? 1 : 0.4,
            }}
            key={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

const ProductCarouselItem = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="h-fit w-[calc(100vw-32px)] bg-black">
      <Image
        className="w-full h-fit"
        src={src}
        alt={alt}
        width={1080}
        height={1080}
      />
    </div>
  );
};

export default ProductGallery;
