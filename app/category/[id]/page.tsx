import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchCategory } from '@/lib/graphql/queries';
import FilmGrid from '@/components/FilmGrid';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = await fetchCategory(id);
  return {
    title: `${category.name} — Samansa`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await fetchCategory(id);

  return (
    <>
      <Link
        href="/"
        className="mb-6 flex cursor-pointer items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
      >
        ← Home
      </Link>
      <h1 className="mb-8 text-3xl font-bold text-white">{category.name}</h1>
      <FilmGrid films={category.videos} />
    </>
  );
}
