"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageInfo } from "../ProductGallery/ProductGallery";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useRandom } from "@/hooks/useRandom";
import { useViewportBounds } from "@/hooks/useBounds";
import { useInactiveMotionValue } from "@/hooks/useInactiveMotionValue";
import { useEventListener } from "usehooks-ts";
import { useWindowDimension } from "@/hooks/useWindowDimension";

type Props = {
  images: ImageInfo[];
};

const StackGallery = ({ images }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    const nextSlide = currentSlide < images.length - 1 ? currentSlide + 1 : 0;
    setCurrentSlide(nextSlide);
  };

  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const isInView = useInView(containerRef);

  useEffect(() => {
    setCurrentSlide(0);
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden mt-12 pt-12 pb-20 w-full max-w-[48rem] flex justify-center overflow-x-hidden"
    >
      <div className="w-[10%] h-full absolute bg-gradient-to-r from-chalk-white to-transparent z-30 left-0 top-0 bottom-0" />
      <div className="w-[10%] h-full absolute bg-gradient-to-l from-chalk-white to-transparent z-30 right-0 top-0 bottom-0" />
      <div className="relative">
        {images.map((img, index) => {
          return (
            <StackGallerySlide
              key={index}
              onNextSlide={handleNextSlide}
              currentSlide={currentSlide}
              index={index}
              {...img}
            />
          );
        })}
      </div>
    </div>
  );
};

const StackGallerySlide = ({
  src,
  alt,
  index,
  currentSlide,
  onNextSlide,
}: ImageInfo & {
  currentSlide: number;
  index: number;
  onNextSlide: () => void;
}) => {
  const random = useRandom([]);

  const exitDirection = useRef(1);

  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const windowDim = useWindowDimension();
  const [isDragging, setIsDragging] = useState(false);

  const DRAG_COMMIT_DIST = 200;
  const isOverDragThreshold = useRef(false);
  const FLICK_THRESHOLD = 100;
  const hasFlickDetected = useRef(false);

  const pointerOffsetX = useMotionValue(0);

  const isSlidePastCurrent = currentSlide > index;

  const pointerInitialX = useMotionValue(0);

  const x = useTransform(pointerOffsetX, (pointerXLatest: any) => {
    if (isSlidePastCurrent) {
      return DRAG_COMMIT_DIST * 3 * exitDirection.current;
    }

    if (isDragging) {
      return pointerXLatest;
    }
    return 0;
  });

  useMotionValueEvent(pointerOffsetX, "change", (latest) => {
    if (Math.abs(pointerOffsetX.getVelocity()) > FLICK_THRESHOLD) {
      hasFlickDetected.current = true;
      return;
    }
    hasFlickDetected.current = false;
  });

  const isInView = useInView(containerRef, { amount: 0.5 });
  const rotationOffset = random * 40 - 20;
  const rotateZ = useInactiveMotionValue(
    useTransform(
      x,
      [-windowDim.width / 2, 0, windowDim.width / 2],
      [-20 + rotationOffset, +rotationOffset, 20 + rotationOffset]
    ),
    isDragging,
    isInView ? rotationOffset : 0
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    // const offset = bounds.left - e.clientX;
    pointerInitialX.set(e.clientX);
    pointerOffsetX.set(0);

    hasFlickDetected.current = false;
    isOverDragThreshold.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const offset = e.clientX - pointerInitialX.get();
    pointerOffsetX.set(offset);
  };

  useEventListener("pointerup", () => {
    if (Math.abs(x.get()) > DRAG_COMMIT_DIST) {
      isOverDragThreshold.current = true;
    }
    setIsDragging(false);
  });

  const handleNextSlide = () => {
    exitDirection.current = x.getVelocity() < 0 ? 1 : -1;
    onNextSlide();
  };

  useEffect(() => {
    if (
      !isDragging &&
      (hasFlickDetected.current || isOverDragThreshold.current)
    ) {
      handleNextSlide();
    }
  }, [isDragging]);

  return (
    <motion.div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onClick={() => {
        // if (Math.abs(x.get()) > 5) return;
        // handleNextSlide();
      }}
      animate={{
        // opacity: isSlidePastCurrent ? 0 : 1,
        boxShadow: `0px ${isDragging ? "15" : "5"}px ${
          isDragging ? "20" : "10"
        }px rgba(164, 160, 160, 0.2)`,
      }}
      style={{
        position: index === 0 ? "relative" : "absolute",
        pointerEvents: isSlidePastCurrent ? "none" : "all",
        x,
        // opacity: isSlidePastCurrent ? 0 : 1,
        rotateZ,
        scale: isDragging ? 1.05 : 1,
        transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 29 - index,
        cursor: "grab",
      }}
      whileTap={{
        cursor: "grabbing",
      }}
      className="top-0 left-0 max-w-96 border-8 border-white touch-pan-y select-none"
    >
      <motion.div className="drop-shadow-lg pointer-events-none max-w-[60vw]">
        <Image src={src} alt={alt} width={756} height={1008} />
      </motion.div>
    </motion.div>
  );
};

export default StackGallery;
