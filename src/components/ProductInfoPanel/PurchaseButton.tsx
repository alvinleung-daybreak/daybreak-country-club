import React from "react";
import { EMAIL_SUBSCRIPTION_LINK } from "./ProductForm";

type Props = {
  isSoldOut: boolean;
};

const PurchaseButton = ({ isSoldOut }: Props) => {
  return (
    <div>
      <button
        disabled={isSoldOut}
        type="submit"
        className="font-country-sans-sm font-bold px-4 py-4 bg-chalk-white text-forest-green w-full"
        style={{
          opacity: isSoldOut ? 0.5 : 1,
        }}
      >
        {isSoldOut ? "Sold out" : "Buy now"}
      </button>
      <div
        className="mt-4 font-sans-sm"
        style={{
          opacity: isSoldOut ? 1 : 0,
        }}
      >
        Sign up to our newsletter to be the first to hear about future restocks
        and stay up-to-date on all things Daybreak{" "}
        <a href={EMAIL_SUBSCRIPTION_LINK} target="_blank">
          here
        </a>
        .
      </div>
    </div>
  );
};

export default PurchaseButton;
