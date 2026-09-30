import cloudinaryData from "../data/cloudinary-images.json";

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: string | number; // default 'auto'
  format?: string; // default 'auto'
  crop?: string; // e.g. 'fill', 'scale', 'limit', 'fit'
}

export interface CloudinaryPropsOptions extends CloudinaryOptions {
  alt?: string;
  isHero?: boolean;
  sizes?: string;
  className?: string;
}

const CLOUD_NAME =
  (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME ||
  cloudinaryData.cloudName ||
  "diaza-studio";

const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// Internal cache for missing image reports
const missingImagesSet = new Set<string>();

/**
 * Normalizes local image path to match JSON key format
 */
function normalizePath(pathOrKey: string): string {
  if (!pathOrKey) return "";
  let clean = pathOrKey.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  if (!clean.startsWith("/")) {
    clean = "/" + clean;
  }
  return clean;
}

/**
 * Returns optimized Cloudinary URL for any local image path or public ID
 */
export function getCloudinaryUrl(
  pathOrKey: string,
  options: CloudinaryOptions = {}
): string {
  if (!pathOrKey) return "";

  // If already a full external URL (like S3 or external CDN), return as-is or transform if Cloudinary
  if (pathOrKey.startsWith("http://") || pathOrKey.startsWith("https://")) {
    if (pathOrKey.includes("res.cloudinary.com")) {
      return transformCloudinaryUrl(pathOrKey, options);
    }
    return pathOrKey;
  }

  const key = normalizePath(pathOrKey);

  // If Cloudinary is explicitly disabled or not configured with a custom cloud, use local path directly
  const isCloudinaryActive = Boolean((import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME);
  if (!isCloudinaryActive) {
    return pathOrKey;
  }

  const mapped = (cloudinaryData.images as Record<string, any>)[key];

  if (!mapped) {
    if (!missingImagesSet.has(key)) {
      missingImagesSet.add(key);
      console.warn(`[Cloudinary Helper] Missing image mapping for: ${key}. Falling back to local path.`);
    }
    return pathOrKey;
  }

  const publicId = mapped.publicId;
  const transformations = buildTransformations(options);

  return `${BASE_URL}/${transformations}/${publicId}`;
}

/**
 * Builds transformation string (e.g. f_auto,q_auto,w_800,c_fill)
 */
function buildTransformations(options: CloudinaryOptions): string {
  const parts: string[] = [];

  const format = options.format || "auto";
  const quality = options.quality || "auto";

  parts.push(`f_${format}`);
  parts.push(`q_${quality}`);

  if (options.crop) {
    parts.push(`c_${options.crop}`);
  }

  if (options.width) {
    parts.push(`w_${options.width}`);
  }

  if (options.height) {
    parts.push(`h_${options.height}`);
  }

  return parts.join(",");
}

/**
 * Transforms an existing Cloudinary URL by inserting transformations
 */
function transformCloudinaryUrl(url: string, options: CloudinaryOptions): string {
  const transformations = buildTransformations(options);
  if (url.includes("/image/upload/")) {
    return url.replace("/image/upload/", `/image/upload/${transformations}/`);
  }
  return url;
}

/**
 * Generates responsive srcset string for standard widths
 */
export function getCloudinarySrcSet(
  pathOrKey: string,
  widths: number[] = [320, 640, 960, 1280, 1920],
  crop?: string
): string {
  if (!pathOrKey) return "";
  if (pathOrKey.startsWith("http://") || pathOrKey.startsWith("https://")) {
    return "";
  }

  return widths
    .map((w) => `${getCloudinaryUrl(pathOrKey, { width: w, crop })} ${w}w`)
    .join(", ");
}

/**
 * Returns props for an <img> element with responsive Cloudinary URL, lazy/eager loading, srcset
 */
export function getCloudinaryImageProps(
  pathOrKey: string,
  options: CloudinaryPropsOptions = {}
) {
  const { isHero = false, alt = "Diaza Studio interior design", sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", crop } = options;

  const src = getCloudinaryUrl(pathOrKey, options);
  const srcSet = getCloudinarySrcSet(pathOrKey, [320, 640, 960, 1280, 1600], crop);

  return {
    src,
    srcSet: srcSet || undefined,
    sizes: srcSet ? sizes : undefined,
    alt,
    loading: isHero ? ("eager" as const) : ("lazy" as const),
    fetchPriority: isHero ? ("high" as const) : ("auto" as const),
  };
}

/**
 * Reports all missing images that were queried but not mapped
 */
export function getMissingImagesReport(): string[] {
  return Array.from(missingImagesSet);
}

/**
 * Verifies all images in driveImages manifest against Cloudinary JSON
 */
export function verifyAllCloudinaryUrls(): { total: number; mapped: number; missing: string[] } {
  const allKeys = Object.keys(cloudinaryData.images);
  return {
    total: cloudinaryData.totalCount || allKeys.length,
    mapped: allKeys.length,
    missing: Array.from(missingImagesSet),
  };
}
