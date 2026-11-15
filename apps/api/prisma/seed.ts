import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../src/lib/db.js";
import { processImage } from "../src/lib/images.js";
import { storage, uploadsRoot } from "../src/lib/storage/index.js";

// ───────── EDIT THIS: the 3 files you put in the uploads folder ─────────
const SOURCE_IMAGES = ["image1.jpg", "image2.jpg", "image3.jpg"];

type Audience = "RETAIL" | "WHOLESALE";
type Processed = Awaited<ReturnType<typeof processImage>>;

interface OfferSeed {
  audience: Audience;
  unitsPerPack: number;
  price: number; // price of ONE pack, in Toman (placeholder values)
  minPacks?: number;
}
interface VariantSeed {
  sku: string;
  color?: string;
  model?: string;
  stock: number;
  noImages?: boolean; // for testing the "no image" UI state
  offers: OfferSeed[];
}
interface ProductSeed {
  slug: string;
  name: string;
  description: string;
  categories: string[];
  variants: VariantSeed[];
}
interface CategorySeed {
  slug: string;
  name: string;
  children: { slug: string; name: string }[];
}

// ───────── Data ─────────
const categories: CategorySeed[] = [
  {
    slug: "drinkware",
    name: "ظروف و لیوان",
    children: [
      { slug: "mugs", name: "ماگ" },
      { slug: "teaware", name: "ست چای‌خوری" },
    ],
  },
  {
    slug: "decor",
    name: "دکوراسیون",
    children: [
      { slug: "candles", name: "شمع و عطر" },
      { slug: "frames", name: "قاب عکس" },
    ],
  },
  {
    slug: "stationery",
    name: "لوازم‌التحریر",
    children: [
      { slug: "notebooks", name: "دفترچه و یادداشت" },
      { slug: "pens", name: "خودکار و قلم" },
    ],
  },
  {
    slug: "occasions",
    name: "مناسبت‌ها",
    children: [
      { slug: "birthday", name: "تولد" },
      { slug: "wedding", name: "عروسی و سالگرد" },
    ],
  },
  {
    slug: "packaging",
    name: "بسته‌بندی هدیه",
    children: [
      { slug: "gift-boxes", name: "جعبه هدیه" },
      { slug: "wrapping", name: "کاغذ کادو و روبان" },
    ],
  },
];

const products: ProductSeed[] = [
  {
    slug: "ceramic-mug",
    name: "ماگ سرامیکی ساده",
    description:
      "ماگ سرامیکی با لعاب براق و دسته راحت، مناسب هدیه‌های روزمره و کادوی تولد.",
    categories: ["mugs", "birthday"],
    variants: [
      {
        sku: "MUG-WHITE",
        color: "سفید",
        stock: 200,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 450_000 },
          { audience: "WHOLESALE", unitsPerPack: 4, price: 1_600_000 },
          { audience: "WHOLESALE", unitsPerPack: 8, price: 3_000_000 },
        ],
      },
      {
        // retail-only variant: wholesale customers never see it
        sku: "MUG-BLUE",
        color: "آبی",
        stock: 60,
        offers: [{ audience: "RETAIL", unitsPerPack: 1, price: 470_000 }],
      },
      {
        sku: "MUG-BLACK",
        color: "مشکی",
        stock: 120,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 460_000 },
          { audience: "WHOLESALE", unitsPerPack: 6, price: 2_400_000 },
        ],
      },
    ],
  },
  {
    slug: "printed-mug",
    name: "ماگ طرح‌دار",
    description: "ماگ با طراحی دست‌نقاشی، مناسب هدیه برای دوستان و همکاران.",
    categories: ["mugs"],
    variants: [
      {
        sku: "PMUG-FLOWER",
        model: "طرح گل",
        stock: 90,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 520_000 },
          { audience: "WHOLESALE", unitsPerPack: 6, price: 2_700_000 },
        ],
      },
      {
        sku: "PMUG-STAR",
        model: "طرح ستاره",
        stock: 75,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 520_000 },
          { audience: "WHOLESALE", unitsPerPack: 6, price: 2_700_000 },
        ],
      },
    ],
  },
  {
    slug: "tea-set-6",
    name: "ست چای‌خوری شش نفره",
    description:
      "ست کامل شامل شش فنجان و نعلبکی در جعبه هدیه؛ انتخابی شیک برای مراسم خانوادگی.",
    categories: ["teaware", "wedding"],
    variants: [
      {
        sku: "TEASET-CLASSIC",
        model: "کلاسیک",
        stock: 40,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 2_900_000 },
          { audience: "WHOLESALE", unitsPerPack: 2, price: 5_200_000 },
        ],
      },
    ],
  },
  {
    slug: "scented-candle",
    name: "شمع معطر دست‌ساز",
    description:
      "شمع معطر با موم سویا و عطر ماندگار، در ظرف شیشه‌ای با درب چوبی.",
    categories: ["candles", "birthday"],
    variants: [
      {
        sku: "CANDLE-VANILLA",
        model: "وانیل",
        stock: 150,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 320_000 },
          { audience: "WHOLESALE", unitsPerPack: 6, price: 1_500_000 },
        ],
      },
      {
        sku: "CANDLE-LAVENDER",
        model: "اسطوخودوس",
        stock: 130,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 320_000 },
          { audience: "WHOLESALE", unitsPerPack: 6, price: 1_500_000 },
        ],
      },
      {
        sku: "CANDLE-SANDAL",
        model: "چوب صندل",
        stock: 100,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 350_000 },
          { audience: "WHOLESALE", unitsPerPack: 6, price: 1_650_000 },
        ],
      },
    ],
  },
  {
    slug: "wooden-frame",
    name: "قاب عکس چوبی",
    description: "قاب عکس چوبی با طراحی ساده و مینیمال، مناسب عکس ۱۳ در ۱۸.",
    categories: ["frames", "wedding"],
    variants: [
      {
        sku: "FRAME-BROWN",
        color: "قهوه‌ای",
        stock: 80,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 380_000 },
          { audience: "WHOLESALE", unitsPerPack: 12, price: 3_900_000 },
        ],
      },
      {
        // out of stock: for testing the sold-out UI state
        sku: "FRAME-WHITE",
        color: "سفید",
        stock: 0,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 380_000 },
          { audience: "WHOLESALE", unitsPerPack: 12, price: 3_900_000 },
        ],
      },
    ],
  },
  {
    slug: "leather-notebook",
    name: "دفترچه یادداشت جلد چرمی",
    description:
      "دفترچه ۱۶۰ برگ با جلد چرم مصنوعی و کاغذ بدون اسید، مناسب هدیه‌های اداری.",
    categories: ["notebooks"],
    variants: [
      {
        sku: "NOTE-BLACK",
        color: "مشکی",
        stock: 140,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 290_000 },
          { audience: "WHOLESALE", unitsPerPack: 10, price: 2_400_000 },
        ],
      },
      {
        sku: "NOTE-BROWN",
        color: "قهوه‌ای",
        stock: 110,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 290_000 },
          { audience: "WHOLESALE", unitsPerPack: 10, price: 2_400_000 },
        ],
      },
      {
        sku: "NOTE-NAVY",
        color: "سرمه‌ای",
        stock: 95,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 290_000 },
          { audience: "WHOLESALE", unitsPerPack: 10, price: 2_400_000 },
        ],
      },
    ],
  },
  {
    slug: "gift-pen-set",
    name: "ست خودکار هدیه",
    description: "ست دو تکه خودکار و روان‌نویس فلزی در جعبه مخمل.",
    categories: ["pens"],
    variants: [
      {
        sku: "PEN-CLASSIC",
        model: "کلاسیک",
        stock: 70,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 650_000 },
          { audience: "WHOLESALE", unitsPerPack: 5, price: 2_800_000 },
        ],
      },
    ],
  },
  {
    slug: "wedding-favor",
    name: "یادبود مراسم عروسی",
    description: "هدیه کوچک و زیبا برای مهمانان مراسم عروسی و سالگرد ازدواج.",
    categories: ["wedding"],
    variants: [
      {
        sku: "FAVOR-GOLD",
        color: "طلایی",
        stock: 600,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 150_000 },
          { audience: "WHOLESALE", unitsPerPack: 24, price: 2_900_000 },
        ],
      },
    ],
  },
  {
    slug: "gift-box-premium",
    name: "جعبه هدیه شیک",
    description: "جعبه مقوایی سخت با درب مغناطیسی و روبان ساتن.",
    categories: ["gift-boxes"],
    variants: [
      {
        sku: "BOX-PREMIUM",
        color: "کرم",
        stock: 300,
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 120_000 },
          { audience: "WHOLESALE", unitsPerPack: 20, price: 2_000_000 },
        ],
      },
    ],
  },
  {
    // wholesale-only product: retail customers get a 404
    slug: "gift-box-bulk",
    name: "جعبه هدیه ساده (ویژه خرید عمده)",
    description:
      "جعبه کارتنی ساده برای بسته‌بندی سفارش‌های عمده؛ فقط برای خریداران عمده.",
    categories: ["gift-boxes"],
    variants: [
      {
        sku: "BOX-BULK",
        stock: 2000,
        offers: [
          {
            audience: "WHOLESALE",
            unitsPerPack: 50,
            price: 3_500_000,
            minPacks: 2,
          },
        ],
      },
    ],
  },
  {
    slug: "satin-ribbon",
    name: "روبان ساتن",
    description: "رول روبان ساتن ۲۵ متری برای بسته‌بندی هدیه.",
    categories: ["wrapping"],
    variants: [
      {
        sku: "RIBBON-RED",
        color: "قرمز",
        stock: 250,
        noImages: true, // no images: for testing the placeholder state
        offers: [
          { audience: "RETAIL", unitsPerPack: 1, price: 45_000 },
          { audience: "WHOLESALE", unitsPerPack: 20, price: 700_000 },
        ],
      },
    ],
  },
];

// ───────── Image helpers ─────────
async function loadImages(): Promise<Processed[]> {
  const out: Processed[] = [];
  for (const name of SOURCE_IMAGES) {
    const file = path.join(uploadsRoot, name);
    let buffer: Buffer;
    try {
      buffer = await readFile(file);
    } catch {
      throw new Error(
        `Seed image not found: ${file}\nEdit SOURCE_IMAGES at the top of prisma/seed.ts`,
      );
    }
    out.push(await processImage(buffer));
  }
  return out;
}

async function ensureCategoryImage(slug: string, img: Processed) {
  const c = await prisma.category.findUniqueOrThrow({
    where: { slug },
    select: { id: true, imageKey: true },
  });
  if (c.imageKey) return;
  const key = `categories/${randomUUID()}.webp`;
  await storage.put(key, img.data);
  await prisma.category.update({
    where: { id: c.id },
    data: { imageKey: key },
  });
}

async function ensureVariantImages(
  variantId: string,
  alt: string,
  imgs: Processed[],
) {
  if ((await prisma.productVariantImage.count({ where: { variantId } })) > 0)
    return;
  const rows = [];
  for (const [i, img] of imgs.entries()) {
    // every row gets its own file, so deleting one image never affects another
    const key = `variants/${variantId}/${randomUUID()}.webp`;
    await storage.put(key, img.data);
    rows.push({
      variantId,
      key,
      alt,
      width: img.width,
      height: img.height,
      sortOrder: i,
    });
  }
  await prisma.productVariantImage.createMany({ data: rows });
}

// ───────── Seeding ─────────
async function seedCategories(images: Processed[]) {
  let n = 0;
  for (const [i, root] of categories.entries()) {
    const parent = await prisma.category.upsert({
      where: { slug: root.slug },
      update: { name: root.name, parentId: null, sortOrder: i },
      create: { slug: root.slug, name: root.name, sortOrder: i },
    });
    await ensureCategoryImage(root.slug, images[n++ % images.length]);

    for (const [j, child] of root.children.entries()) {
      await prisma.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name, parentId: parent.id, sortOrder: j },
        create: {
          slug: child.slug,
          name: child.name,
          parentId: parent.id,
          sortOrder: j,
        },
      });
      await ensureCategoryImage(child.slug, images[n++ % images.length]);
    }
  }
}

async function seedProducts(images: Processed[]) {
  let counter = 0;
  for (const p of products) {
    const links = p.categories.map((slug) => ({ slug }));
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        categories: { set: links },
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        categories: { connect: links },
      },
    });

    for (const v of p.variants) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          productId: product.id,
          color: v.color ?? null,
          model: v.model ?? null,
          stock: v.stock,
        },
        create: {
          productId: product.id,
          sku: v.sku,
          color: v.color,
          model: v.model,
          stock: v.stock,
        },
      });

      for (const o of v.offers) {
        const minPacks = o.minPacks ?? 1;
        await prisma.productVariantOffer.upsert({
          where: {
            variantId_audience_unitsPerPack: {
              variantId: variant.id,
              audience: o.audience,
              unitsPerPack: o.unitsPerPack,
            },
          },
          update: { price: o.price, minPacks },
          create: {
            variantId: variant.id,
            audience: o.audience,
            unitsPerPack: o.unitsPerPack,
            price: o.price,
            minPacks,
          },
        });
      }

      if (!v.noImages) {
        // alternate between 1 and 2 images per variant to exercise galleries
        const first = images[counter % images.length];
        const imgs =
          counter % 2 === 0
            ? [first, images[(counter + 1) % images.length]]
            : [first];
        const alt = [p.name, v.color, v.model].filter(Boolean).join(" - ");
        await ensureVariantImages(variant.id, alt, imgs);
      }
      counter++;
    }
  }
}

async function main() {
  const images = await loadImages();
  await seedCategories(images);
  await seedProducts(images);
  console.log("Seed done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
