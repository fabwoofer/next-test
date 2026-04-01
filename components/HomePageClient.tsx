'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import {
  fetchCategory,
  CategoryWithFilms,
  HomeScreenEntry,
} from '@/lib/graphql/queries';
import CategorySection from './CategorySection';
import FilmGrid from './FilmGrid';

const BATCH_SIZE = 3;
const FILMS_PER_CATEGORY = 6;

interface HomePageClientProps {
  allCategories: HomeScreenEntry[];
  initialBatchData: CategoryWithFilms[];
}

function CategorySkeleton() {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-7 w-40 animate-pulse rounded bg-gray-800" />
        <div className="h-4 w-14 animate-pulse rounded bg-gray-800" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: FILMS_PER_CATEGORY }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video rounded-lg bg-gray-800" />
            <div className="mt-2 h-3 w-3/4 rounded bg-gray-800" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePageClient({
  allCategories,
  initialBatchData,
}: HomePageClientProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['homePageCategories', allCategories.map((s) => s.category.id)],
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const batch = allCategories.slice(pageParam, pageParam + BATCH_SIZE);
        const results = await Promise.all(
          batch.map(({ category }) => fetchCategory(category.id)),
        );
        return results.map((c) => ({
          ...c,
          videos: c.videos.slice(0, FILMS_PER_CATEGORY),
        }));
      },
      initialPageParam: 0,
      getNextPageParam: (_, allPages) => {
        const totalLoaded = allPages.reduce((sum, page) => sum + page.length, 0);
        return totalLoaded < allCategories.length ? totalLoaded : undefined;
      },
      initialData: {
        pages: [initialBatchData],
        pageParams: [0],
      },
    });

  // Trigger fetchNextPage when the sentinel scrolls into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '300px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const loadedCategories = data.pages.flat();

  return (
    <>
      {loadedCategories.map((category) => (
        <CategorySection
          key={category.id}
          categoryId={category.id}
          categoryName={category.name}
        >
          <FilmGrid films={category.videos} />
        </CategorySection>
      ))}

      {isFetchingNextPage &&
        Array.from({ length: BATCH_SIZE }).map((_, i) => (
          <CategorySkeleton key={i} />
        ))}

      {/* Sentinel — sits below all content; triggers load when scrolled into view */}
      <div ref={sentinelRef} />
    </>
  );
}
