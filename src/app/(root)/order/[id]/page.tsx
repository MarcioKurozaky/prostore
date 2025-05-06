import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";

import { ShippingAddress } from "@/types";

import OrderDetailsTable from "./order-details-table";
import { auth } from "@/auth";

import Stripe from "stripe";

export const metadata = {
  title: "Order Details",
};

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}
export default async function OrderDetailsPage(props: OrderDetailsPageProps) {
  const { id } = await props.params;

  const order = await getOrderById(id);

  if (!order) notFound();

  const session = await auth();

  let client_secret = null;

  // Check if using Stripe and not paid
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    // Initialize Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create a new payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user.role === "admin" || false} // Add this line
    />
  );
}
