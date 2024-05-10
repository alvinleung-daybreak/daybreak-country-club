"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SizeSelector from "./SizeSelector";
import PurchaseButton from "./PurchaseButton";
import { useTennisHitSound } from "@/hooks/useTennisHitSound";
import { SweatshirtProductInfo } from "@/app/SweatshirtProductInfo";
import ProductForm from "./ProductForm";
import { AnimatePresence } from "framer-motion";

type Props = {};

// const sizes = [
//   { name: "s", isAvailable: true },
//   { name: "m", isAvailable: true },
//   { name: "l", isAvailable: false },
//   { name: "xl", isAvailable: true },
// ];

const ProductInfoPanel = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [productInfo, setProductInfo] = useState<SweatshirtProductInfo[]>([]);

  useEffect(() => {
    async function load() {
      const result = await fetch("/api/products");
      setProductInfo(await result.json());
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col items-center text-center mx-8 font-sans-sm max-w-[42ch]">
      <div className="font-country-sans-sm mb-6">Limited Edition</div>
      <h1 className="font-country-script-display mb-10">
        Country Club Sweatshirt
      </h1>
      <p className="mb-4">
        Whether you’re taking a rest day away from the courts or heading to your
        next big match, our exclusive membership sweatshirt will keep you warm,
        comfortable, and stylish.
      </p>
      <p className="mb-4">
        In addition to the sweatshirt, your membership bundle will also include
        the following: a custom Penn-branded collaborative tennis ball, a
        personalized welcome letter, and your very own membership card.
      </p>

      <small className="mb-4 font-sans-xs opacity-50 max-w-[30ch]">
        Susanna is 5’5” and wearing a size Medium. Dean is 6’1” and wearing a
        size Large
      </small>
      <div className="font-country-sans-md font-bold mb-14">$100.00 USD</div>

      <ProductForm productInfo={productInfo} />
    </div>
  );
};

export default ProductInfoPanel;
