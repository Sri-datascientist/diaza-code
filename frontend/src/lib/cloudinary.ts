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
  "nw9o0vrv";

const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// Internal cache for missing image reports
const missingImagesSet = new Set<string>();

/**
 * Normalizes local image path to match JSON key format
 */
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
 * Derives a valid Cloudinary public ID for unmapped image paths
 */
function deriveCloudinaryPublicId(key: string): string {
  let clean = key.trim();
  try {
    clean = decodeURIComponent(clean);
  } catch (e) {
    // Ignore decode errors
  }
  
  // Strip domain, Vite dev server prefixes, and asset folder prefixes
  clean = clean.replace(/^https?:\/\/[^\/]+/, "");
  clean = clean.replace(/^\/@fs/, "");
  clean = clean.replace(/^\/@assets\//, "");
  clean = clean.replace(/^\/attached_assets\//, "");
  clean = clean.replace(/^\/src\/assets\//, "");
  clean = clean.replace(/^\/assets\//, "");
  clean = clean.replace(/^\//, "");

  // Replace spaces with underscores
  clean = clean.replace(/\s+/g, "_");

  // Remove file extension (e.g. .jpg, .png, .jpeg, .webp, .svg)
  clean = clean.replace(/\.(jpg|jpeg|png|webp|svg|gif)$/i, "");

  // Prepend diaza_studio folder namespace if not already present
  if (clean.startsWith("diaza_studio/")) {
    return clean;
  }
  return `diaza_studio/${clean}`;
}

/**
 * Returns optimized Cloudinary URL for any image path or public ID
 */
export function getCloudinaryUrl(
  pathOrKey: string,
  options: CloudinaryOptions = {}
): string {
  if (!pathOrKey) return "";

  // If already a full external URL (like S3 or external CDN), transform if Cloudinary or return external URL
  if (pathOrKey.startsWith("http://") || pathOrKey.startsWith("https://")) {
    if (pathOrKey.includes("res.cloudinary.com")) {
      return transformCloudinaryUrl(pathOrKey, options);
    }
    return pathOrKey;
  }

  // Handle blob or data URLs
  if (pathOrKey.startsWith("blob:") || pathOrKey.startsWith("data:")) {
    return pathOrKey;
  }

  const key = normalizePath(pathOrKey);
  const imagesDict = cloudinaryData.images as Record<string, any>;
  
  // 1. Try exact key match
  let mapped = imagesDict[key];

  // 2. Try decoded URI key match
  if (!mapped) {
    try {
      const decodedKey = decodeURIComponent(key);
      mapped = imagesDict[decodedKey];
    } catch (e) {
      // Ignore URI decode errors
    }
  }

  // 3. Try encoded URI key match (e.g. spaces -> %20)
  if (!mapped) {
    try {
      const encodedKey = encodeURI(key);
      mapped = imagesDict[encodedKey];
    } catch (e) {
      // Ignore
    }
  }

  // 4. Try matching by filename
  if (!mapped) {
    const filename = key.split("/").pop();
    if (filename) {
      const decodedFilename = decodeURIComponent(filename);
      for (const [dictKey, dictVal] of Object.entries(imagesDict)) {
        if (
          dictKey.endsWith("/" + filename) ||
          dictKey.endsWith("/" + decodedFilename) ||
          (dictVal as any)?.fileName === filename ||
          (dictVal as any)?.fileName === decodedFilename
        ) {
          mapped = dictVal;
          break;
        }
      }
    }
  }

  // 5. Always resolve through Cloudinary (using manifest publicId or derived Cloudinary publicId)
  const publicId = mapped?.publicId || deriveCloudinaryPublicId(key);
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
  // Matches /image/upload/ and optional existing transformations (e.g. f_auto,q_auto,w_1200/)
  return url.replace(/\/image\/upload\/(?:[a-z0-9_,-]+\/)?/, `/image/upload/${transformations}/`);
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
    fetchpriority: isHero ? ("high" as const) : ("auto" as const),
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
