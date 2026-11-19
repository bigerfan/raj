import { getCurrentUser } from "@/lib/api/server/auth";
import { getCategories } from "@/lib/api/server/categories";
import { getProducts } from "@/lib/api/server/products";

export default async function Page() {
  const [user, categories, products] = await Promise.all([
    getCurrentUser(),
    getCategories(),
    getProducts(),
  ]);
  return (
    <pre dir="ltr">
      {JSON.stringify({ user, categories, products }, null, 2)}
    </pre>
  );
}
