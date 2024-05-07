"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageInfo } from "../ProductGallery/ProductGallery";
import {
  clamp,
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
import { useDebounceCallback, useEventListener } from "usehooks-ts";
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
    <div className="relative overflow-hidden mt-12 pt-12 pb-20 w-full max-w-[48rem] flex justify-center overflow-x-hidden">
      <div className="w-[10%] h-full absolute bg-gradient-to-r from-chalk-white to-transparent z-40 left-0 top-0 bottom-0" />
      <div className="w-[10%] h-full absolute bg-gradient-to-l from-chalk-white to-transparent z-40 right-0 top-0 bottom-0" />
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
  const bounds = useViewportBounds(containerRef, []);

  const inView = useInView(containerRef);
  const [isDragging, setIsDragging] = useState(false);

  const wheelOffset = useMotionValue(0);

  const DRAG_COMMIT_DIST = 200;
  const isOverDragThreshold = useRef(false);
  const FLICK_THRESHOLD = 100;
  const hasFlickDetected = useRef(false);

  const pointer = usePointerPosition(inView);
  const pointerOffsetX = useMotionValue(0);

  const isSlidePastCurrent = currentSlide > index;

  const x = useTransform(
    [pointer.x, wheelOffset],
    ([pointerXLatest, wheelOffsetLatest]: any) => {
      if (isSlidePastCurrent) {
        return DRAG_COMMIT_DIST * 3 * exitDirection.current;
      }

      if (wheelOffset.get() !== 0) {
        return wheelOffsetLatest;
      }

      if (isDragging) {
        return pointerXLatest + pointerOffsetX.get() - bounds.x;
      }
      return 0;
    }
  );

  useMotionValueEvent(pointer.x, "change", (latest) => {
    if (Math.abs(pointer.x.getVelocity()) > FLICK_THRESHOLD) {
      hasFlickDetected.current = true;
      return;
    }
    hasFlickDetected.current = false;
  });

  const rotationOffset = random * 20 - 10;
  const rotateZ = useInactiveMotionValue(
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
    isOverDragThreshold.current = false;
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

  const resetOffset = useDebounceCallback(() => {
    wheelOffset.set(0);
  }, 500);

  const handleWheel = (e: React.WheelEvent) => {
    // e.preventDefault();
    // const newOffsetX = wheelOffset.get() + e.deltaX;
    // wheelOffset.set(newOffsetX);
    // resetOffset();
  };

  return (
    <motion.div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onClick={() => {
        // if (Math.abs(x.get()) > 5) return;
        // handleNextSlide();
      }}
      onWheel={handleWheel}
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
        transition: "transform .6s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 30 - index,
      }}
      className="top-0 left-0 max-w-96 border-8 border-white  cursor-grab"
    >
      <motion.div className="drop-shadow-lg pointer-events-none select-none">
        <Image src={src} alt={alt} width={756} height={1008} />
      </motion.div>
    </motion.div>
  );
};

export default StackGallery;
