import React from "react";

type Props = {
  isSoldOut: boolean;
  onSubmit: () => void;
};

const PurchaseButton = ({ isSoldOut }: Props) => {
  return (
    <button className="font-country-sans-sm font-bold px-4 py-4 bg-chalk-white text-forest-green w-full">
      {isSoldOut ? "Sold out" : "Buy now"}
    </button>
  );
};

export default PurchaseButton;
