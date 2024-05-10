import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WindowDimensionContextProvider } from "@/hooks/useWindowDimension";
import PointerContextProvider from "@/components/PointerContextProvider/PointerContextProvider";

const fractul_regular = localFont({
  src: "../../public/typography/fractul-regular.woff2",
  display: "swap",
  variable: "--font-fractul-regular",
  weight: "400",
});

const founders_grotesk_regular = localFont({
  src: "../../public/typography/founders-grotesk-regular.woff2",
  display: "swap",
  variable: "--font-founders-grotesk-regular",
  weight: "400",
});

const founders_grotesk_condensed = localFont({
  src: "../../public/typography/founders-grotesk-condensed-regular.woff2",
  display: "swap",
  variable: "--font-founders-grotesk-condensed-regular",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Daybreak Country Club",
  description:
    "For our third-year anniversary, we reimagined Daybreak Studio as a country club in its heyday. Step into the world of Daybreak Country Club.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${fractul_regular.variable}
          ${founders_grotesk_regular.variable}
          ${founders_grotesk_condensed.variable}
        `}
      >
        <WindowDimensionContextProvider>
          <PointerContextProvider>{children}</PointerContextProvider>
        </WindowDimensionContextProvider>
      </body>
    </html>
  );
}
