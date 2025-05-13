import DealCountdown from "@/components/shared/deal-countdown";
import IconBoxes from "@/components/shared/icon-boxes";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/productList";
import ViewAllProductsButton from "@/components/shared/view-all-products-button";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";

import React from "react";

export default async function HomePage() {
  const latestProducts = await getLatestProducts();

  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList title="Newest Arrivals" data={latestProducts} limit={4} />

      <ViewAllProductsButton />

      <DealCountdown />
      <IconBoxes />
    </>
  );
}
