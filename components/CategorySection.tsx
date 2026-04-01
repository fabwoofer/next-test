import Link from 'next/link';
import { ReactNode } from 'react';

interface CategorySectionProps {
  categoryId: string;
  categoryName: string;
  children: ReactNode;
}

export default function CategorySection({
  categoryId,
  categoryName,
  children,
}: CategorySectionProps) {
  return (
    <section className="mb-12" data-testid="category-section">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{categoryName}</h2>
        <Link
          href={`/category/${categoryId}`}
          className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
          data-testid="category-link"
        >
          See all →
        </Link>
      </div>
      {children}
    </section>
  );
}
