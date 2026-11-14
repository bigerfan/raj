import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/db.js";
import { AppError } from "../../common/errors.js";
import { processImage } from "../../lib/images.js";
import { storage } from "../../lib/storage/index.js";

const MAX_IMAGES_PER_VARIANT = 10;

const imageSelect = {
  id: true,
  key: true,
  alt: true,
  width: true,
  height: true,
  sortOrder: true,
} as const;

async function listImages(variantId: string) {
  const rows = await prisma.productVariantImage.findMany({
    where: { variantId },
    orderBy: { sortOrder: "asc" },
    select: imageSelect,
  });
  return rows.map(({ key, ...r }) => ({ ...r, url: storage.url(key) }));
}

export async function addVariantImages(
  variantId: string,
  files: Express.Multer.File[],
) {
  if (files.length === 0)
    throw new AppError(400, "No files uploaded", "NO_FILES");

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    select: { id: true },
  });
  if (!variant)
    throw new AppError(404, "Variant not found", "VARIANT_NOT_FOUND");

  const { _count, _max } = await prisma.productVariantImage.aggregate({
    where: { variantId },
    _count: true,
    _max: { sortOrder: true },
  });
  if (_count + files.length > MAX_IMAGES_PER_VARIANT) {
    throw new AppError(
      400,
      `A variant can have at most ${MAX_IMAGES_PER_VARIANT} images`,
      "TOO_MANY_IMAGES",
    );
  }

  let sortOrder = (_max.sortOrder ?? -1) + 1;
  const savedKeys: string[] = [];
  try {
    const rows = [];
    for (const file of files) {
      const img = await processImage(file.buffer);
      const key = `variants/${variantId}/${randomUUID()}.webp`;
      await storage.put(key, img.data);
      savedKeys.push(key);
      rows.push({
        variantId,
        key,
        width: img.width,
        height: img.height,
        sortOrder: sortOrder++,
      });
    }
    await prisma.productVariantImage.createMany({ data: rows });
  } catch (err) {
    // don't leave files behind if any step failed
    await Promise.allSettled(savedKeys.map((k) => storage.remove(k)));
    throw err;
  }
  return listImages(variantId);
}

export async function deleteVariantImage(imageId: string) {
  const image = await prisma.productVariantImage.findUnique({
    where: { id: imageId },
  });
  if (!image) throw new AppError(404, "Image not found", "IMAGE_NOT_FOUND");

  // DB first: a failure after this leaves a harmless orphan file, never a row pointing to nothing
  await prisma.productVariantImage.delete({ where: { id: imageId } });
  await storage
    .remove(image.key)
    .catch((e) => console.error("Failed to remove file", image.key, e));
}
