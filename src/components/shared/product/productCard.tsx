import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./productPrice";
import { Product } from "@/types";
import placeholder from "@/assets/images/no-image.png";
import Rating from "./rating";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader className="p-0 overflow-hidden rounded-t-2xl">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="overflow-hidden rounded-t-2xl">
            <Image
              priority
              src={product.images[0] || placeholder}
              alt={product.name}
              height={300}
              width={300}
              className="aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4 grid gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {product.brand}
        </span>

        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-semibold hover:underline line-clamp-2">
            {product.name}
          </h2>
        </Link>

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-yellow-500 font-medium">
            <Rating value={Number(product.rating)} />
          </span>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <span className="text-sm text-destructive">Out of Stock</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
