import React, { useEffect, useMemo, useState } from "react";
import SizeSelector from "./SizeSelector";
import PurchaseButton from "./PurchaseButton";
import { SweatshirtProductInfo } from "@/app/SweatshirtProductInfo";
import { useTennisHitSound } from "@/hooks/useTennisHitSound";
import { motion } from "framer-motion";
import Spinner from "../Spinner/Spinner";

type Props = {
  productInfo: SweatshirtProductInfo[];
};

export const EMAIL_SUBSCRIPTION_LINK =
  "https://daybreakstudio.beehiiv.com/subscribe";

const ProductForm = ({ productInfo }: Props) => {
  const [size, setSize] = useState(productInfo[0]?.size || "");

  useEffect(() => {
    if (productInfo[0]) setSize(productInfo[0].size);
  }, [productInfo]);

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
    <div className="relative">
      <motion.div
        className="absolute inset-0 flex items-start justify-start pointer-events-none"
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          opacity: productInfo.length === 0 ? 1 : 0,
          y: productInfo.length === 0 ? 0 : 20,
        }}
      >
        <Spinner />
      </motion.div>
      <motion.form
        action={formActionHref}
        target="blank"
        className="w-full"
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: productInfo.length === 0 ? 0 : 1,
          y: productInfo.length === 0 ? -20 : 0,
        }}
      >
        <SizeSelector
          products={productInfo}
          onSelect={setSize}
          onClick={handleSelectorClicked}
          currentSize={size}
        />
        <PurchaseButton isSoldOut={!isItemAvailable} />
      </motion.form>
    </div>
  );
};

export default ProductForm;
