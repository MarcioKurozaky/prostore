"use client";

import { useRouter } from "next/navigation";

//toast
import { toast } from "sonner";

//ui
import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader } from "lucide-react";

//cart item type
import { CartItem, Cart } from "@/types";

//add to card action
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";

//react transition
import { useTransition } from "react";

interface AddToCartProps {
  cart?: Cart;
  item: CartItem;
}
export default function AddToCart({ cart, item }: AddToCartProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(
        <div className="flex items-center justify-between gap-4">
          <span className="text-blue-600 font-medium">
            {item.name} adicionado ao carrinho!
          </span>
          <button
            className="bg-primary text-white px-2 py-1 rounded hover:bg-gray-800 transition whitespace-nowrap "
            onClick={() => router.push("/cart")}
          >
            Go To Cart
          </button>
        </div>
      );
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast.success(
        <div className="flex items-center justify-between gap-4">
          <span className="text-blue-600 font-medium">{res.message}</span>
        </div>
      );
      return;
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4  animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={handleAddToCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to cart
    </Button>
  );
}
