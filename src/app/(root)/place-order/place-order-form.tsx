"use client";
import { useRouter } from "next/navigation";

//ui
import { Check, Loader } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

//create Order
import { createOrder } from "@/lib/actions/order.actions";

export default function PlaceOrderForm() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await createOrder();

    console.log("====================================");
    console.log(res);
    console.log("====================================");

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}
        Place Order
      </Button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
}
