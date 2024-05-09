import Stripe from "stripe";
import prisma from "@/utils/prisma";
import { NextResponse, NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  const allProducts = await prisma.product.findMany();

  try {
    for (let i = 0; i < allProducts.length; i++) {
      const prismaProduct = allProducts[i];
      await stripe.products.update(prismaProduct.stripeProductId, {
        active: prismaProduct.stock > 0,
      });

      const stripeProduct = await stripe.products.retrieve(
        prismaProduct.stripeProductId
      );

      console.log(stripeProduct.url);

      // add the updated link
      await prisma.product.update({
        where: { id: prismaProduct.id },
        data: { stripeLink: stripeProduct.url as string },
      });
    }

    return NextResponse.json({
      status: "Success",
      allProducts,
    });
  } catch (error) {
    return NextResponse.json({ status: "Failed", error });
  }
}
