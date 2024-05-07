"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageInfo } from "../ProductGallery/ProductGallery";
import {
  motion,
  useDragControls,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useRandom } from "@/hooks/useRandom";
import { useBounds, useViewportBounds } from "@/hooks/useBounds";
import {
  usePointerOffset,
  usePointerOffsetNormalized,
  usePointerPosition,
} from "@/hooks/usePointerInfo";
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

  return (
    <div className="overflow-hidden mt-12 py-8 w-full flex justify-center">
      <div className="relative ">
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
  const bounds = useViewportBounds(containerRef, []);

  const inView = useInView(containerRef);
  const [isDragging, setIsDragging] = useState(false);
  const hasFlickDetected = useRef(false);

  const pointer = usePointerPosition(inView);
  const pointerOffsetX = useMotionValue(0);
  const FLICK_THRESHOLD = 20;

  const isSlidePastCurrent = currentSlide > index;

  const x = useTransform(pointer.x, (latest) => {
    if (isSlidePastCurrent) {
      return 300 * exitDirection.current;
    }

    if (isDragging) {
      return latest + pointerOffsetX.get() - bounds.x;
    }
    return 0;
  });

  useMotionValueEvent(x, "change", (latest) => {
    if (Math.abs(x.getVelocity()) > FLICK_THRESHOLD) {
      hasFlickDetected.current = true;
    }
  });

  const rotationOffset = random * 10 - 5;
  const rotate = useInactiveMotionValue(
    useTransform(
      x,
      [-windowDim.width / 2, 0, windowDim.width / 2],
      [-20 + rotationOffset, +rotationOffset, 20 + rotationOffset]
    ),
    isDragging,
    rotationOffset
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    const offset = bounds.left - e.clientX;
    pointerOffsetX.set(offset);
    hasFlickDetected.current = false;
  };
  useEventListener("pointerup", () => {
    setIsDragging(false);
  });

  const handleNextSlide = () => {
    exitDirection.current = x.getVelocity() < 0 ? 1 : -1;
    onNextSlide();
  };

  useEffect(() => {
    if (!isDragging && hasFlickDetected.current) handleNextSlide();
  }, [isDragging]);

  return (
    <motion.div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onClick={() => {
        if (Math.abs(x.get()) > 5) return;
        handleNextSlide();
      }}
      animate={{
        opacity: isSlidePastCurrent ? 0 : 1,
      }}
      style={{
        position: index === 0 ? "relative" : "absolute",
        pointerEvents: isSlidePastCurrent ? "none" : "all",
        x,
        opacity: isSlidePastCurrent ? 0 : 1,
        rotate,
        scale: isDragging ? 1.05 : 1,
        transition: "transform .7s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 100 - index,
      }}
      className="top-0 left-0 max-w-96 border-8 border-white  cursor-grab drop-shadow-lg"
    >
      <motion.div className="drop-shadow-lg pointer-events-none select-none">
        <Image src={src} alt={alt} width={756} height={1008} />
      </motion.div>
    </motion.div>
  );
};

export default StackGallery;
