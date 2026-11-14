import { storage } from "../../lib/storage/index.js";

interface OfferRow {
  id: string;
  unitsPerPack: number;
  price: number;
  minPacks: number;
}
interface VariantRow {
  id: string;
  sku: string;
  color: string | null;
  model: string | null;
  stock: number;
  images: ImageRow[];
  offers: OfferRow[];
}
export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  categories: { slug: string; name: string }[];
  variants: VariantRow[];
}

interface ImageRow {
  id: string;
  key: string;
  alt: string | null;
  width: number;
  height: number;
}
// add `images: ImageRow[]` to VariantRow

const toImage = (i: ImageRow) => ({
  id: i.id,
  url: storage.url(i.key),
  alt: i.alt,
  width: i.width,
  height: i.height,
});

function toOffer(o: OfferRow, stock: number) {
  const availablePacks = Math.floor(stock / o.unitsPerPack);
  return {
    id: o.id,
    unitsPerPack: o.unitsPerPack,
    price: o.price, // price of ONE pack
    minPacks: o.minPacks,
    availablePacks,
    inStock: availablePacks >= o.minPacks,
  };
}

/** Full product with variants and the offers this audience may see. */
export function toProductDetail(p: ProductRow) {
  const first = p.variants.flatMap((v) => v.images)[0];

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    categories: p.categories,
    image: first ? toImage(first) : null,
    variants: p.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      color: v.color,
      model: v.model,
      offers: v.offers.map((o) => toOffer(o, v.stock)),
    })),
  };
}

/** Compact shape for product cards. */
export function toProductCard(p: ProductRow) {
  const offers = p.variants.flatMap((v) =>
    v.offers.map((o) => toOffer(o, v.stock)),
  );
  const cheapest = offers.reduce<(typeof offers)[number] | null>(
    (best, o) => (best === null || o.price < best.price ? o : best),
    null,
  );
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categories: p.categories,
    colors: [
      ...new Set(
        p.variants.map((v) => v.color).filter((c): c is string => !!c),
      ),
    ],
    priceFrom: cheapest && {
      price: cheapest.price,
      unitsPerPack: cheapest.unitsPerPack,
    },
    inStock: offers.some((o) => o.inStock),
  };
}
