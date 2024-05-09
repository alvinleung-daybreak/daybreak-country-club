import Stripe from "stripe";
import prisma from "@/utils/prisma";
import { NextResponse, NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const dynamic = "force-dynamic";
export async function GET() {
  const allProducts = await prisma.product.findMany();

  const allStripePaymentLinks = await stripe.paymentLinks.list();

  try {
    for (let i = 0; i < allProducts.length; i++) {
      const prismaProduct = allProducts[i];
      const productPaymentLink = allStripePaymentLinks.data.find(
        ({ url }) => url === prismaProduct.stripeLink
      );

      if (!productPaymentLink?.id) {
        throw "Cannot procceed: payment link not found";
      }

      const isProductAvailable = prismaProduct.stock > 0;

      await stripe.paymentLinks.update(productPaymentLink.id, {
        active: isProductAvailable,
      });
      await stripe.products.update(prismaProduct.stripeProductId, {
        active: isProductAvailable,
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
