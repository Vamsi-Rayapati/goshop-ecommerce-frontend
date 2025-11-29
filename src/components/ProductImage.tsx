'use client';

interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className }: ProductImageProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder-product.svg';
  };

  return (
    <img
      src={src || '/placeholder-product.svg'}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
}