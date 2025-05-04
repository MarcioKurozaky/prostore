import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function ViewAllProductsButton() {
  return (
    <div className="flex justify-center items-center my-10">
      <Button
        asChild
        size="lg"
        className="px-8 py-4 text-lg font-semibold rounded-full shadow-md hover:shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-primary transition-all duration-300 text-white flex items-center gap-2 active:scale-95"
      >
        <Link href="/search">
          View All Products
          <ArrowRight className="w-5 h-5" />
        </Link>
      </Button>
    </div>
  );
}
