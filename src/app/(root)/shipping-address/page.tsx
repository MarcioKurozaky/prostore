import { Metadata } from "next";
import { redirect } from "next/navigation";

//next auth config
import { auth } from "@/auth";

//get cart
import { getMyCart } from "@/lib/actions/cart.actions";

//get user by id
import { getUserById } from "@/lib/actions/user.actions";

//Shipping Address types
import { ShippingAddress } from "@/types";

//Shipping Address form
import ShippingAddressForm from "./shipping-address-form";

//Checkout Steps
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
  title: "Shipping Address",
};

export default async function ShippingAddressPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User ID not found");
  }

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={1} />

      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
}
