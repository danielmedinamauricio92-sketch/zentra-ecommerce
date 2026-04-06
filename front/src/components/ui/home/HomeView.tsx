import { ZentraBanner } from "@/components/home/Banner";
import { HomeProductsSection } from "@/components/home/HomeProductsSection";
import { getProducts } from "@/services/product.service";

export default async function HomeView() {
  const products = await getProducts();

  return (
    <>
      <ZentraBanner />
      <HomeProductsSection products={products} />
    </>
  );
}