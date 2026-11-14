import multer from "multer";

// Memory storage: the raw file never touches disk, only the processed WebP does.
// Worst case is 10 files x 5 MB in memory per request, acceptable because only admins can upload.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});
