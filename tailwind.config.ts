import type { Config } from "tailwindcss";
import TypeSystemPlugin from "./TypeSystemPlugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "forest-green": "#1B2420",
        "chalk-white": "#FFFCF2",
        "melton-yellow": "#D4FF00",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    // the db country club fonts
    TypeSystemPlugin({
      default: {
        "country-sans-sm": {
          "font-family": "presicav",
          "font-size": "10px",
          "letter-spacing": "1.6px",
          "text-transform": "uppercase",
        },
        "country-sans-md": {
          "font-family": "presicav",
          "font-size": "12px",
          "letter-spacing": "1px",
          "text-transform": "uppercase",
        },
        "country-script-display": {
          "font-family": "p22-albemarle-pro",
          "font-size": "48px",
          "line-height": "1.2em",
        },
      },
      md: {
        "country-sans-sm": {
          "font-family": "presicav",
          "font-size": "10px",
          "letter-spacing": "1.6px",
          "text-transform": "uppercase",
        },
        "country-sans-md": {
          "font-family": "presicav",
          "font-size": "12px",
          "letter-spacing": "1px",
          "text-transform": "uppercase",
        },
        "country-script-display": {
          "font-family": "p22-albemarle-pro",
          "font-size": "48px",
        },
      },
    }),
    // founders grotesk
    TypeSystemPlugin({
      default: {
        "sans-sm": {
          "font-family": "var(--font-founders-grotesk-regular)",
          "font-size": "16px",
          "letter-spacing": "0.0rem",
          "line-height": "20px",
        },
        "sans-xs": {
          "font-family": "var(--font-founders-grotesk-regular)",
          "font-size": "14px",
          "letter-spacing": "0.0rem",
          "line-height": "20px",
        },
        "sans-2xs": {
          "font-family": "var(--font-founders-grotesk-regular)",
          "font-size": "10px",
          "letter-spacing": "0.0rem",
        },
      },
      md: {
        "sans-sm": {
          "font-family": "var(--font-founders-grotesk-regular)",
          "font-size": "16px",
          "letter-spacing": "0.01em",
          "line-height": "20px",
        },
        "sans-xs": {
          "font-family": "var(--font-founders-grotesk-regular)",
          "font-size": "14px",
          "letter-spacing": "0.0rem",
          "line-height": "20px",
        },
        "sans-2xs": {
          "font-family": "var(--font-founders-grotesk-regular)",
          "font-size": "12px",
          "letter-spacing": "0.0rem",
        },
      },
    }),
    // founders grotesk condensed
    TypeSystemPlugin({
      default: {
        "cond-xs": {
          "font-family": "var(--font-founders-grotesk-condensed-regular)",
          "font-size": "14px",
          "letter-spacing": "0.02rem",
          "line-height": "100%",
          "text-transform": "uppercase",
        },
        "cond-sm": {
          "font-family": "var(--font-founders-grotesk-condensed-regular)",
          "font-size": "16px",
          "letter-spacing": "0.02rem",
          "line-height": "100%",
          "text-transform": "uppercase",
        },
      },
      lg: {},
    }),
    // fractul
    TypeSystemPlugin({
      default: {
        // factul
        "brand-2xl": {
          "font-family": "var(--font-fractul-regular)",
          "font-size": "72px",
          "letter-spacing": "-0.03rem",
          "line-height": "64px",
        },
        "brand-xl": {
          "font-family": "var(--font-fractul-regular)",
          "font-size": "64px",
          "letter-spacing": "-0.03rem",
          "line-height": "64px",
        },
        "brand-lg": {
          "font-family": "var(--font-fractul-regular)",
          "font-size": "40px",
          "letter-spacing": "-0.03rem",
          "line-height": "46px",
        },
        "brand-md": {
          "font-family": "var(--font-fractul-regular)",
          "font-size": "24px",
          "letter-spacing": "-0.02rem",
          "line-height": "32px",
        },
        "brand-sm": {
          "font-family": "var(--font-fractul-regular)",
          "font-size": "16px",
          "letter-spacing": "0.0rem",
          "line-height": "20px",
        },
      },
    }),
  ],
};
export default config;
