import type { Metadata } from 'next';
import {
  fetchOriginalVideo,
  fetchVideoComments,
  formatDuration,
} from '@/lib/graphql/queries';
import BackButton from '@/components/BackButton';
import CommentsList from '@/components/CommentsList';
import ThumbnailImage from '@/components/ThumbnailImage';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = await fetchOriginalVideo(id);
  return {
    title: `${video.title} — Samansa`,
    description: video.description,
  };
}

export default async function FilmPage({ params }: Props) {
  const { id } = await params;

  // Fetch film data and first page of comments in parallel
  const [video, initialComments] = await Promise.all([
    fetchOriginalVideo(id),
    fetchVideoComments(id, 10),
  ]);

  return (
    <>
    <BackButton />
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Main content — takes 2/3 of the width on large screens */}
      <div className="lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900">
          <ThumbnailImage
            src={video.landscapeThumbnail}
            alt={video.title}
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-white">{video.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span>{formatDuration(video.duration)}</span>
            <span className="flex items-center gap-1">
              <span className="text-accent">♥</span>
              {video.likeNum.toLocaleString()} likes
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-gray-300">{video.description}</p>
        </div>
      </div>

      {/* Sidebar — takes 1/3 of the width on large screens */}
      <aside className="rounded-xl bg-gray-900/50 p-4">
        <CommentsList videoId={id} initialData={initialComments} />
      </aside>
    </div>
    </>
  );
}
