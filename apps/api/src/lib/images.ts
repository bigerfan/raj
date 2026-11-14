import sharp from "sharp";
import { AppError } from "../common/errors.js";

const MAX_SIDE = 1600;

/** Decode, auto-rotate, downscale and re-encode as WebP. Re-encoding also drops EXIF (GPS etc.). */
export async function processImage(input: Buffer) {
  try {
    const { data, info } = await sharp(input, { limitInputPixels: 50_000_000 })
      .rotate()
      .resize({
        width: MAX_SIDE,
        height: MAX_SIDE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height };
  } catch {
    throw new AppError(400, "File is not a valid image", "INVALID_IMAGE");
  }
}
