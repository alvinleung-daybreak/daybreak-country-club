"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SizeSelector from "./SizeSelector";
import PurchaseButton from "./PurchaseButton";
import { useTennisHitSound } from "@/hooks/useTennisHitSound";
import { SweatshirtProductInfo } from "@/app/SweatshirtProductInfo";

type Props = {
  productInfo: SweatshirtProductInfo[];
};

// const sizes = [
//   { name: "s", isAvailable: true },
//   { name: "m", isAvailable: true },
//   { name: "l", isAvailable: false },
//   { name: "xl", isAvailable: true },
// ];

const EMAIL_SUBSCRIPTION_LINK = "https://daybreakstudio.beehiiv.com/subscribe";

const ProductInfoPanel = ({ productInfo }: Props) => {
  const [size, setSize] = useState(productInfo[0].size);

  const isItemAvailable = useMemo(
    () => productInfo.find((info) => info.size === size)?.stock !== 0 || false,
    [size, productInfo]
  );

  const formActionHref = useMemo(() => {
    if (isItemAvailable) {
      return productInfo.find((info) => info.size === size)?.stripeLink;
    }
    return EMAIL_SUBSCRIPTION_LINK;
  }, [productInfo, size, isItemAvailable]);

  const hitSoundEffect = useTennisHitSound();

  const handleSelectorClicked = () => {
    hitSoundEffect.current?.trigger();
  };

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
      <div className="font-country-sans-md font-bold mb-14">$160.00</div>

      <form action={formActionHref} className="w-full">
        <SizeSelector
          products={productInfo}
          onSelect={setSize}
          onClick={handleSelectorClicked}
          currentSize={size}
        />
        <PurchaseButton isSoldOut={!isItemAvailable} />
      </form>
    </div>
  );
};

export default ProductInfoPanel;
