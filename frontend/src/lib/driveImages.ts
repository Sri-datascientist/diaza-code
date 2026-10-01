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

// Tusar Diaza Project Photos
const TUSAR_DIAZA_FILES = [
  "DSC04885-HDR.jpg",
  "DSC04891-HDR.jpg",
  "DSC04894-HDR.jpg",
  "DSC04903-HDR.jpg",
  "DSC04906-HDR.jpg",
  "DSC04909-HDR.jpg",
  "DSC04915-HDR.jpg",
  "DSC04918-HDR.jpg",
  "DSC04921-HDR.jpg",
  "DSC04924-HDR.jpg",
  "DSC04930-HDR.jpg",
  "DSC04936.jpg",
  "DSC04937.jpg",
  "DSC04941.jpg",
  "DSC04943.jpg",
  "DSC04945.jpg",
  "DSC04947.jpg",
  "DSC04948.jpg",
  "DSC04949.jpg",
  "DSC04950-HDR.jpg",
  "DSC04956-HDR.jpg",
  "DSC04959-HDR.jpg",
  "DSC04962-HDR.jpg",
  "DSC04965-HDR.jpg",
  "DSC04968-HDR.jpg",
  "DSC04971-HDR.jpg",
  "DSC04974-HDR.jpg",
  "DSC04977-HDR.jpg",
  "DSC04980-HDR.jpg",
  "DSC04983-HDR.jpg",
  "DSC04986-HDR.jpg",
  "DSC04989-HDR.jpg",
  "DSC04992-HDR.jpg",
  "DSC04995-HDR.jpg",
  "DSC04998-HDR.jpg",
  "DSC05001-HDR.jpg",
  "DSC05004-HDR.jpg",
  "DSC05007-HDR.jpg",
  "DSC05010-HDR.jpg",
  "DSC05013-HDR.jpg",
  "DSC05016-HDR.jpg",
  "DSC05019-HDR.jpg",
  "DSC05022-HDR.jpg",
  "DSC05025-HDR.jpg",
  "DSC05028-HDR.jpg",
  "DSC05031-HDR.jpg",
  "DSC05034-HDR.jpg",
  "DSC05037-HDR.jpg",
  "DSC05040-HDR.jpg",
  "DSC05046-HDR.jpg",
  "DSC05049-HDR.jpg",
  "DSC05055-HDR.jpg",
  "DSC05058-HDR.jpg",
  "DSC05061-HDR.jpg",
  "DSC05064-HDR.jpg",
  "DSC05067-HDR.jpg",
  "DSC05070-HDR.jpg",
  "DSC05073-HDR.jpg",
  "DSC05076-HDR.jpg",
  "DSC05079-HDR.jpg",
  "DSC05082-HDR.jpg",
  "DSC05085-HDR.jpg",
  "DSC05088-HDR.jpg",
  "DSC05091-HDR.jpg",
  "DSC05094-HDR.jpg",
  "DSC05097-HDR.jpg",
  "DSC05100-HDR.jpg",
  "DSC05103-HDR.jpg",
  "DSC05106-HDR.jpg",
  "DSC05109-HDR.jpg",
  "DSC05112-HDR.jpg",
  "DSC05118-HDR.jpg",
  "DSC05121-HDR.jpg",
  "DSC05124-HDR.jpg",
  "DSC05127-HDR.jpg",
  "DSC05130-HDR.jpg",
  "DSC05133-HDR.jpg",
  "DSC05136-HDR.jpg",
  "DSC05139-HDR.jpg",
  "DSC05142-HDR.jpg",
  "DSC05145-HDR.jpg",
  "DSC05148-HDR.jpg",
  "DSC05151-HDR.jpg",
  "DSC05154-HDR.jpg",
  "DSC05157-HDR.jpg",
  "DSC05160-HDR.jpg",
  "DSC05163-HDR.jpg",
  "DSC05166-HDR.jpg",
  "DSC05169-HDR.jpg",
  "DSC05172-HDR.jpg",
  "DSC05175-HDR.jpg",
  "DSC05178-HDR.jpg",
  "DSC05181-HDR.jpg",
  "DSC05184-HDR.jpg",
  "DSC05187-HDR.jpg",
  "DSC05190-HDR.jpg",
  "DSC05193-HDR.jpg",
  "DSC05196-HDR.jpg",
  "DSC05199-HDR.jpg",
  "DSC05202-HDR.jpg",
  "DSC05205-HDR.jpg",
  "DSC05208-HDR.jpg",
  "DSC05211-HDR.jpg"
];

const tusarDiazaImages: DriveImageData[] = TUSAR_DIAZA_FILES.map((fileName, idx) => {
  const localPath = `/Tusar_diaza/${encodeURIComponent(fileName)}`;
  return {
    id: `tusar-diaza-${idx + 1}`,
    name: `Tusar Diaza Project ${idx + 1}`,
    s3_url: getCloudinaryUrl(localPath, { width: 1200 }),
    s3_key: `Tusar_diaza/${fileName}`,
    localPath: localPath,
    fileName: fileName,
    fileType: "image/jpeg",
    size: 0,
    project: "Tusar Diaza Project",
    roomType: "Interior Architecture"
  };
});

// Reju Diaza Project Photos
const REJU_DIAZA_FILES = [
  "DSC03315-01.jpeg",
  "DSC03320-01.jpeg",
  "DSC03323-01.jpeg",
  "DSC03356.JPG",
  "DSC03361-01.jpeg",
  "DSC03370-01.jpeg",
  "DSC03394-01.jpeg",
  "DSC03398-01.jpeg",
  "DSC03411-01.jpeg",
  "DSC03415-01.jpeg",
  "DSC03424-01.jpeg",
  "DSC03429 (2)-01.jpeg",
  "DSC03460.JPG",
  "DSC03470.JPG",
  "DSC03473.JPG",
  "DSC03500-01-01.jpeg",
  "DSC03507-01.jpeg",
  "DSC03511-01.jpeg",
  "DSC03512-01.jpeg",
  "DSC03532-01.jpeg",
  "DSC03546-01.jpeg",
  "DSC03548-01.jpeg",
  "DSC03578-01.jpeg",
  "DSC03592-01.jpeg",
  "DSC03592.JPG",
  "IMG_20230217_164442-01.jpeg"
];

const rejuDiazaImages: DriveImageData[] = REJU_DIAZA_FILES.map((fileName, idx) => {
  const localPath = `/reju_diaza/${encodeURIComponent(fileName)}`;
  return {
    id: `reju-diaza-${idx + 1}`,
    name: `Reju Diaza Project ${idx + 1}`,
    s3_url: getCloudinaryUrl(localPath, { width: 1200 }),
    s3_key: `reju_diaza/${fileName}`,
    localPath: localPath,
    fileName: fileName,
    fileType: "image/jpeg",
    size: 0,
    project: "Reju Diaza Project",
    roomType: "Interior Design"
  };
});

// Vasundhara Diaza Project Photos
const VASUNDHARA_DIAZA_FILES = [
  "1688653086239-01(1).jpeg",
  "1688653086239-01.jpeg",
  "IMG_20230620_133829.jpg",
  "IMG_20230706_184932.jpg",
  "IMG_20230706_184954(1).jpg",
  "IMG_20230706_184954-01(1).jpeg",
  "IMG_20230706_184954-01.jpeg",
  "IMG_20230706_184954.jpg",
  "IMG_20230706_185216(1).jpg",
  "IMG_20230706_185216-01.jpeg",
  "IMG_20230706_185216.jpg",
  "IMG_20230706_185734.jpg",
  "IMG_20230706_185805.jpg",
  "IMG_20230706_190138.jpg",
  "IMG_20230706_190309.jpg",
  "image(1).jpg",
  "image.jpg"
];

const vasundharaDiazaImages: DriveImageData[] = VASUNDHARA_DIAZA_FILES.map((fileName, idx) => {
  const localPath = `/vasundhara_diaza/${encodeURIComponent(fileName)}`;
  return {
    id: `vasundhara-diaza-${idx + 1}`,
    name: `Vasundhara Diaza Project ${idx + 1}`,
    s3_url: getCloudinaryUrl(localPath, { width: 1200 }),
    s3_key: `vasundhara_diaza/${fileName}`,
    localPath: localPath,
    fileName: fileName,
    fileType: "image/jpeg",
    size: 0,
    project: "Vasundhara Diaza Project",
    roomType: "Interior Design"
  };
});

// Sagamitra Diaza Project Photos
const SAGAMITRA_DIAZA_FILES = [
  "Copy of Copy of DSC03416.jpg",
  "Copy of Copy of DSC03427.jpg",
  "Copy of Copy of DSC03430.jpg",
  "Copy of Copy of DSC03484.jpg",
  "Copy of Copy of DSC03519.jpg",
  "Copy of Copy of DSC03540.jpg",
  "Copy of Copy of DSC03620.jpg",
  "Copy of Copy of DSC03624.jpg",
  "Copy of Copy of DSC03629.jpg",
  "Copy of Copy of DSC03630.jpg",
  "Copy of Copy of DSC03636.jpg",
  "Copy of Copy of DSC03711.jpg",
  "Copy of Copy of DSC03733.jpg",
  "Copy of Copy of DSC03736.jpg",
  "Copy of Copy of DSC03741.jpg",
  "Copy of Copy of DSC03747.jpg",
  "Copy of Copy of DSC03762.jpg",
  "Copy of Copy of DSC03777.jpg",
  "Copy of Copy of DSC03827.jpg",
  "Copy of Copy of DSC03830.jpg"
];

const sagamitraDiazaImages: DriveImageData[] = SAGAMITRA_DIAZA_FILES.map((fileName, idx) => {
  const localPath = `/sagamitra_diaza/${encodeURIComponent(fileName)}`;
  return {
    id: `sagamitra-diaza-${idx + 1}`,
    name: `Sagamitra Diaza Project ${idx + 1}`,
    s3_url: getCloudinaryUrl(localPath, { width: 1200 }),
    s3_key: `sagamitra_diaza/${fileName}`,
    localPath: localPath,
    fileName: fileName,
    fileType: "image/jpeg",
    size: 0,
    project: "Sagamitra Diaza Project",
    roomType: "Interior Design"
  };
});

export const LOCAL_DRIVE_IMAGES: DriveImageData[] = [
  ...tusarDiazaImages,
  ...rejuDiazaImages,
  ...vasundharaDiazaImages,
  ...sagamitraDiazaImages
];
