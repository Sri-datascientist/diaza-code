import { useQuery } from "@tanstack/react-query";

interface S3Image {
  id: string;
  name: string;
  s3Url: string;
  s3Key: string;
  fileName: string;
  fileType: string;
  size: number;
  project: string;
  roomType: string;
}

interface S3ImageProps {
  folderPath?: string;
  index?: number;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

export function S3Image({ folderPath = "beula/", index = 0, alt = "Portfolio image", className = "", fallbackSrc }: S3ImageProps) {
  const { data, isLoading } = useQuery<{ images: S3Image[] }>({
    queryKey: ['/api/public/s3/images', folderPath],
  });

  if (isLoading && fallbackSrc) {
    return <img src={fallbackSrc} alt={alt} className={className} />;
  }

  if (isLoading) {
    return <div className={`${className} bg-[#D4C4B0] animate-pulse`} />;
  }

  const image = data?.images?.[index];
  
  if (!image && fallbackSrc) {
    return <img src={fallbackSrc} alt={alt} className={className} />;
  }

  if (!image) {
    return <div className={`${className} bg-[#D4C4B0]`} />;
  }

  return (
    <img
      src={image.s3Url || fallbackSrc || ''}
      alt={alt}
      className={className}
    />
  );
}
