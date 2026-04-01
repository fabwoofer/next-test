'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="mb-6 flex cursor-pointer items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
    >
      ← Back
    </button>
  );
}
