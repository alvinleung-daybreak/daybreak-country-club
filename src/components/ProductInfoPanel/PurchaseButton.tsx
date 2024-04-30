import React from "react";

type Props = {
  isSoldOut: boolean;
  onSubmit: () => void;
};

const PurchaseButton = ({ isSoldOut }: Props) => {
  return (
    <div>
      <button className="font-country-sans-sm font-bold px-4 py-4 bg-chalk-white text-forest-green w-full">
        {isSoldOut ? "Notify me" : "Buy now"}
      </button>
      <div
        className="mt-4 font-sans-sm"
        style={{
          opacity: isSoldOut ? 1 : 0,
        }}
      >
        Sign up to our newsletter to be the first to hear about future restocks
        and stay up-to-date on all things Daybreak here.
      </div>
    </div>
  );
};

export default PurchaseButton;
