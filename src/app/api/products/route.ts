import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { SizingInfo, SweatshirtProductInfo } from "@/app/SweatshirtProductInfo";

export const dynamic = "force-dynamic";

const sizingOrderLookup = {
  s: 0,
  m: 1,
  l: 2,
  xl: 3,
};

export async function GET(req: NextRequest) {
  const productsData = await prisma.product.findMany();
  const productInfo: SweatshirtProductInfo[] = productsData
    .map(({ stripeLink, name, priceInCent, stock }) => {
      return {
        stripeLink: stripeLink,
        size: name
          .replace("Daybreak Country Club Sweatshirt ", "")
          .toLocaleLowerCase() as SizingInfo,
        stock: stock,
        priceInCent: priceInCent,
      };
    })
    .sort((a, b) => sizingOrderLookup[a.size] - sizingOrderLookup[b.size]);
  return NextResponse.json(productInfo);
}
