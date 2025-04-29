import { Metadata } from "next";

//next_auth config
import { auth } from "@/auth";

//get user by Id
import { getUserById } from "@/lib/actions/user.actions";

//Payment Method Form
import PaymentMethodForm from "./payment-method-form";

//component Checkout Steps
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
  title: "Payment Method",
};

export default async function PaymentMethodPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User ID not found");
  }

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
}
