import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

//product_price
import ProductPrice from "./productPrice";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.slug}`}>
          <Image
            priority={true}
            src={product.images[0]}
            alt={product.name}
            className="aspect-square object-cover rounded"
            height={300}
            width={300}
          />
        </Link>
      </CardHeader>

      <CardContent className="p-4 grid gap-4">
        <div className="text-xs text-muted-foreground">{product.brand}</div>

        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium hover:underline">
            {product.name}
          </h2>
        </Link>

        <div className="flex justify-between items-center gap-4">
          <p className="text-sm">{product.rating} ⭐</p>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive text-sm">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
