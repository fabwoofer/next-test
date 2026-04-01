'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ThumbnailImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export default function ThumbnailImage({
  src,
  alt,
  sizes,
  priority = false,
  className = '',
}: ThumbnailImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {!imageLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          data-testid="thumbnail-spinner"
        >
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-600 border-t-accent" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        onLoad={() => setImageLoaded(true)}
        className={`object-cover transition-all duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        sizes={sizes}
      />
    </>
  );
}
