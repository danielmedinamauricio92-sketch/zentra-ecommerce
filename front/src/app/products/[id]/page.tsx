import ProductDetailView from "@/components/ui/products/ProductDetailView";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return <ProductDetailView id={id} />;
}