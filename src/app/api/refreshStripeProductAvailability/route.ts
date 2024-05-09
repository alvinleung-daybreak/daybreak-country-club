import Stripe from "stripe";
import prisma from "@/utils/prisma";
import { NextResponse, NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  const allProducts = await prisma.product.findMany();

  try {
    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      await stripe.products.update(product.stripeProductId, {
        active: product.stock > 0,
      });
    }
    return NextResponse.json({
      status: "Success",
    });
  } catch (error) {
    return NextResponse.json({ status: "Failed", error });
  }
}
