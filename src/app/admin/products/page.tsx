import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
    </>
  );
}
