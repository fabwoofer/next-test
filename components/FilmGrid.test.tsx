import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilmGrid from './FilmGrid';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const sampleFilms = [
  {
    id: '1',
    title: 'Film One',
    duration: { minutes: 10, seconds: 0 },
    landscapeThumbnail: 'https://example.com/1.jpg',
  },
  {
    id: '2',
    title: 'Film Two',
    duration: { minutes: 20, seconds: 30 },
    landscapeThumbnail: 'https://example.com/2.jpg',
  },
  {
    id: '3',
    title: 'Film Three',
    duration: { minutes: 5, seconds: 15 },
    landscapeThumbnail: 'https://example.com/3.jpg',
  },
];

describe('FilmGrid', () => {
  it('renders a card for each film', () => {
    render(<FilmGrid films={sampleFilms} />);
    expect(screen.getAllByTestId('film-card')).toHaveLength(3);
  });

  it('renders all film titles', () => {
    render(<FilmGrid films={sampleFilms} />);
    expect(screen.getByText('Film One')).toBeInTheDocument();
    expect(screen.getByText('Film Two')).toBeInTheDocument();
    expect(screen.getByText('Film Three')).toBeInTheDocument();
  });

  it('renders the grid container', () => {
    render(<FilmGrid films={sampleFilms} />);
    expect(screen.getByTestId('film-grid')).toBeVisible();
  });

  it('renders nothing when given an empty array', () => {
    render(<FilmGrid films={[]} />);
    expect(screen.queryAllByTestId('film-card')).toHaveLength(0);
  });
});
