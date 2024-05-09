import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(req: NextRequest) {
  const payload = await req.text();
  const res = JSON.parse(payload);

  const sig = req.headers.get("Stripe-Signature");

  // const dateTime = new Date(res?.created * 1000).toLocaleDateString();
  // const timeString = new Date(res?.created * 1000).toLocaleDateString();

  try {
    let event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
      // process.env.STRIPE_WEBHOOK_SECRET_TEST!
    );

    // console.log("Event", event?.type);
    // charge.succeeded
    // payment_intent.succeeded
    // payment_intent.created

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // Confirm the payment status
      if (session.payment_status === "paid") {
        // console.log("getting product line items");
        // console.log(session.id);
        try {
          // const stripeProductId = "prod_Q4U2BqpuGclB7h";
          // const email = "alvinleung2009@gmail.com";

          const lineItems = await stripe.checkout.sessions.listLineItems(
            session.id
          );
          // console.log("line items:");
          // console.log(lineItems);

          const stripeProductId = String(lineItems.data[0].price?.product);
          const email = session.customer_email;

          const prismaProduct = await prisma.product.findFirst({
            where: { stripeProductId: stripeProductId },
          });

          if (!email) {
            console.log(
              "Email provided is empty, abort adding purchase record"
            );
            return;
          }

          if (!prismaProduct) {
            console.log(
              "Product not found in database, abort adding to purchase record"
            );
            return;
          }

          console.log("adding purchase record");
          await prisma.purchaseRecord.create({
            data: {
              receiptEmail: email,
              createdAt: new Date(res?.created * 1000),
              product: {
                connect: {
                  id: prismaProduct.id,
                },
              },
            },
          });
          console.log("decrementing stock");
          await prisma.product.update({
            where: {
              id: prismaProduct.id,
            },
            data: {
              stock: {
                decrement: 1,
              },
            },
          });
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log("Session not paid for");
      }
    }

    // if (event.type === "payment_intent.succeeded") {
    //   const paymentAmount = res?.data?.object?.amount;
    //   const time = res?.created;
    //   const receiptEmail = res?.data?.object?.receipt_email;
    //   const receiptURL = res?.data?.object?.receipt_url;
    //   console.log(res);
    // }

    // console.log(
    //   res?.data?.object?.billing_details?.email, // email
    //   res?.data?.object?.amount, // amount
    //   JSON.stringify(res), // payment info
    //   res?.type, // type
    //   String(timeString), // time
    //   String(dateTime), // date
    //   res?.data?.object?.receipt_email, // email
    //   res?.data?.object?.receipt_url, // url
    //   JSON.stringify(res?.data?.object?.payment_method_details), // Payment method details
    //   JSON.stringify(res?.data?.object?.billing_details), // Billing details
    //   res?.data?.object?.currency // Currency
    // );

    return NextResponse.json({
      status: "sucess",
      event: event.type,
      response: res,
    });
  } catch (error) {
    return NextResponse.json({ status: "Failed", error });
  }
}
