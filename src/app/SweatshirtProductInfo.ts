export type SizingInfo = "s" | "m" | "l" | "xl";

export interface SweatshirtProductInfo {
  stripeLink: string;
  size: SizingInfo;
  stock: number;
  priceInCent: number;
}
