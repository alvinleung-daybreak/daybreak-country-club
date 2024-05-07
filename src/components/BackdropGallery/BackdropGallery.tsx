"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageInfo } from "../ProductGallery/ProductGallery";

type Props = {
  images: ImageInfo[];
};

const BackdropGallery = ({ images }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div>
      {images.map((img, index) => {
        return (
          <div key={index}>
            <Image src={img.src} alt={img.alt} width={824} height={644} />
          </div>
        );
      })}
    </div>
  );
};

export default BackdropGallery;
