import { getCloudinaryUrl } from "./cloudinary";

export interface DriveImageData {
  id: string;
  name: string;
  s3_url: string; // compatibility with S3Image type
  s3_key: string;
  localPath: string;
  fileName: string;
  fileType: string;
  size: number;
  project: string;
  roomType: string;
}

// Project 3 Drive Photos (Horizontal & Vertical edited collections)
const PROJECT_3_DRIVE_FILES = [
  "DSC03416.jpg", "DSC03427.jpg", "DSC03430.jpg", "DSC03574.jpg", "DSC03620.jpg", "DSC03624.jpg", "DSC03629.jpg",
  "DSC03466.jpg", "DSC03484.jpg", "DSC03498.jpg", "DSC03519.jpg", "DSC03525.jpg", "DSC03540.jpg", "DSC03561.jpg",
  "DSC03605.jpg", "DSC03609.jpg", "DSC03636.jpg", "DSC03642.jpg", "DSC03711.jpg", "DSC03723.jpg", "DSC03730.jpg",
  "DSC03733.jpg", "DSC03736.jpg", "DSC03741.jpg", "DSC03747.jpg", "DSC03762.jpg", "DSC03777.jpg", "DSC03783.jpg",
  "DSC03786.jpg", "DSC03819.jpg", "DSC03827.jpg"
];

// Project Google Photos Album (https://photos.app.goo.gl/4ynHcu712tdxUafs9)
const PROJECT_GPHOTOS_FILES = [
  "gphotos_2.jpg", "gphotos_4.jpg", "gphotos_6.jpg", "gphotos_7.jpg", "gphotos_10.jpg",
  "gphotos_11.jpg", "gphotos_12.jpg", "gphotos_15.jpg", "gphotos_16.jpg", "gphotos_17.jpg",
  "gphotos_19.jpg", "gphotos_27.jpg", "gphotos_30.jpg", "gphotos_31.jpg", "gphotos_32.jpg",
  "gphotos_33.jpg", "gphotos_36.jpg", "gphotos_38.jpg", "gphotos_41.jpg", "gphotos_43.jpg",
  "gphotos_45.jpg", "gphotos_46.jpg", "gphotos_47.jpg", "gphotos_49.jpg", "gphotos_50.jpg",
  "gphotos_52.jpg", "gphotos_53.jpg"
];

// Project 2 (House & Kitchen Interior)
const PROJECT_2_FILES = [
  "1a.jpg",
  "2.jpg",
  "3b.jpg",
  "4.jpg",
  "4a.jpg"
];

// New Gallery Files
const NEW_GALLERY_FILES = [
  "1688653086239-01_1.jpeg",
  "1688653086239-01.jpeg",
  "image_1.jpg",
  "image.jpg",
  "IMG_20230620_133829.jpg",
  "IMG_20230706_184932.jpg",
  "IMG_20230706_184954_1.jpg",
  "IMG_20230706_184954-01_1.jpeg",
  "IMG_20230706_184954-01.jpeg",
  "IMG_20230706_184954.jpg",
  "IMG_20230706_185216_1.jpg",
  "IMG_20230706_185216-01.jpeg",
  "IMG_20230706_185216.jpg",
  "IMG_20230706_185734.jpg",
  "IMG_20230706_185805.jpg",
  "IMG_20230706_190138.jpg",
  "IMG_20230706_190309.jpg"
];

const GALLERY_FILES = [
  "DSC03315-01.jpeg",
  "DSC03320-01.jpeg",
  "DSC03323-01.jpeg",
  "DSC03361-01.jpeg",
  "DSC03370-01.jpeg",
  "DSC03394-01.jpeg",
  "DSC03398-01.jpeg",
  "DSC03411-01.jpeg",
  "DSC03415-01.jpeg",
  "DSC03424-01.jpeg",
  "DSC03429 (2)-01.jpeg",
  "DSC03500-01-01.jpeg",
  "DSC03507-01.jpeg",
  "DSC03511-01.jpeg",
  "DSC03512-01.jpeg",
  "DSC03532-01.jpeg",
  "DSC03546-01.jpeg",
  "DSC03548-01.jpeg",
  "DSC03578-01.jpeg",
  "DSC03592-01.jpeg",
  "IMG_20230217_164442-01.jpeg"
];

const p3DriveImages: DriveImageData[] = PROJECT_3_DRIVE_FILES.map((fileName, idx) => {
  const localPath = `/drive_images/project_3_drive/${encodeURIComponent(fileName)}`;
  return {
    id: `p3-drive-${idx + 1}`,
    name: `Featured Project Interior ${idx + 1}`,
    s3_url: getCloudinaryUrl(localPath, { width: 1200 }),
    s3_key: `project_3_drive/${fileName}`,
    localPath: localPath,
    fileName: fileName,
    fileType: "image/jpeg",
    size: 0,
    project: "Featured Project",
    roomType: "Luxury Interior"
  };
});

const pGphotosImages: DriveImageData[] = PROJECT_GPHOTOS_FILES.map((fileName, idx) => {
  const localPath = `/drive_images/project_photos/${encodeURIComponent(fileName)}`;
  return {
    id: `p-gphotos-${idx + 1}`,
    name: `Project Showcase ${idx + 1}`,
    s3_url: getCloudinaryUrl(localPath, { width: 1200 }),
    s3_key: `project_photos/${fileName}`,
    localPath: localPath,
    fileName: fileName,
    fileType: "image/jpeg",
    size: 0,
    project: "Project Showcase",
    roomType: "Interior Design"
  };
});

const p2Images: DriveImageData[] = PROJECT_2_FILES.map((fileName, idx) => {
  const localPath = `/drive_images/project_2/${encodeURIComponent(fileName)}`;
  return {
    id: `p2-img-${idx + 1}`,
    name: `Kitchen & House Interior ${idx + 1}`,
    s3_url: getCloudinaryUrl(localPath, { width: 1200 }),
    s3_key: `project_2/${fileName}`,
    localPath: localPath,
    fileName: fileName,
    fileType: "image/jpeg",
    size: 0,
    project: "House Interior Project",
    roomType: "Kitchen & Living"
  };
});

const newGalleryImages: DriveImageData[] = NEW_GALLERY_FILES.map((fileName, idx) => {
  const localPath = `/drive_images/gallery_new/${encodeURIComponent(fileName)}`;
  return {
    id: `new-gal-img-${idx + 1}`,
    name: `Gallery Portfolio ${idx + 1}`,
    s3_url: getCloudinaryUrl(localPath, { width: 1200 }),
    s3_key: `gallery_new/${fileName}`,
    localPath: localPath,
    fileName: fileName,
    fileType: "image/jpeg",
    size: 0,
    project: "Gallery Collection",
    roomType: "Interior"
  };
});

const galleryImages: DriveImageData[] = GALLERY_FILES.map((fileName, idx) => {
  const localPath = `/drive_images/gallery/${encodeURIComponent(fileName)}`;
  return {
    id: `drive-img-${idx + 1}`,
    name: fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    s3_url: getCloudinaryUrl(localPath, { width: 1200 }),
    s3_key: `gallery/${fileName}`,
    localPath: localPath,
    fileName: fileName,
    fileType: "image/jpeg",
    size: 0,
    project: "Gallery",
    roomType: "Interior"
  };
});

export const LOCAL_DRIVE_IMAGES: DriveImageData[] = [
  ...p3DriveImages,
  ...pGphotosImages,
  ...p2Images,
  ...newGalleryImages,
  ...galleryImages
];
