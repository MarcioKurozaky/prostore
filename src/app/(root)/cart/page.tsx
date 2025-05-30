import { getMyCart } from "@/lib/actions/cart.actions";
import CartTable from "./cart-table";

export const metadata = {
  title: "Shopping Cart",
};

export default async function CartPage() {
  const cart = await getMyCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
}
