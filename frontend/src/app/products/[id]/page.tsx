import { BACKEND_API_URL } from "@/lib/constants";
import { Product } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const response = await fetch(`${BACKEND_API_URL}/products/${id}`, {
    cache: "force-cache",
  });
  const product: Product = await response.json();

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-xl mb-6">Price: {formatCurrency(product.price)}</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Back to product listing
      </Link>
    </div>
  );
}
