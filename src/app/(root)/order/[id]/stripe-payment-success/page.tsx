import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order.actions";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  // Fetch order
  const order = await getOrderById(id);
  if (!order) notFound();

  // Retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Check if payment intent is valid
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  // Check if payment is successful
  const isSuccess = paymentIntent.status === "succeeded";

  if (!isSuccess) return redirect(`/order/${id}`);

  return (
    <section className="max-w-2xl w-full mx-auto mt-20 px-4 text-center animate-fade-in">
      <div className="flex flex-col items-center gap-6 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-10 border border-zinc-200 dark:border-zinc-800">
        <CheckCircle className="text-green-500 w-16 h-16 animate-pulse" />
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
          Thanks for your purchase!
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300 text-lg">
          We are processing your order.
        </p>

        <Button asChild className="mt-4 text-base px-6 py-3 rounded-xl">
          <Link href={`/order/${id}`}>View Order</Link>
        </Button>
      </div>
    </section>
  );
};

export default SuccessPage;
