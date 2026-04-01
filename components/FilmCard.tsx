'use client';

import Link from 'next/link';
import { Duration, formatDuration } from '@/lib/graphql/queries';
import ThumbnailImage from './ThumbnailImage';

export { formatDuration };

export interface FilmCardProps {
  id: string;
  title: string;
  duration: Duration;
  landscapeThumbnail: string;
}

export default function FilmCard({
  id,
  title,
  duration,
  landscapeThumbnail,
}: FilmCardProps) {
  return (
    <Link href={`/film/${id}`} className="group block" data-testid="film-card">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-800">
        <ThumbnailImage
          src={landscapeThumbnail}
          alt={title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white font-mono">
          {formatDuration(duration)}
        </div>
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-200 line-clamp-2 group-hover:text-accent transition-colors">
        {title}
      </h3>
    </Link>
  );
}
