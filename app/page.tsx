import {
  fetchCategory,
  fetchHomeScreensCategories,
  CategoryWithFilms,
} from '@/lib/graphql/queries';
import HomePageClient from '@/components/HomePageClient';

const INITIAL_BATCH_SIZE = 3;
const FILMS_PER_CATEGORY = 6;

export default async function HomePage() {
  // Lightweight fetch: only category IDs + names, no film data
  const allCategories = await fetchHomeScreensCategories();

  // Prefetch first batch of films server-side for fast initial render
  const firstBatch = allCategories.slice(0, INITIAL_BATCH_SIZE);
  const initialBatchData: CategoryWithFilms[] = await Promise.all(
    firstBatch.map(({ category }) =>
      fetchCategory(category.id).then((c) => ({
        ...c,
        videos: c.videos.slice(0, FILMS_PER_CATEGORY),
      })),
    ),
  );

  return (
    <HomePageClient
      allCategories={allCategories}
      initialBatchData={initialBatchData}
    />
  );
}
