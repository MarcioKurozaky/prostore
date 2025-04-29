import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";

import { ShippingAddress } from "@/types";

import OrderDetailsTable from "./order-details-table";
import { auth } from "@/auth";

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

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user.role === "admin" || false} // Add this line
    />
  );
}
