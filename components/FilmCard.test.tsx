import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilmCard, { formatDuration } from './FilmCard';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    onLoad,
    className,
  }: {
    src: string;
    alt: string;
    onLoad?: () => void;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onLoad={onLoad} className={className} />
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

const defaultProps = {
  id: '42',
  title: 'My Test Film',
  duration: { minutes: 12, seconds: 5 },
  landscapeThumbnail: 'https://example.com/thumb.jpg',
};

describe('FilmCard', () => {
  it('renders the film title', () => {
    render(<FilmCard {...defaultProps} />);
    expect(screen.getByText('My Test Film')).toBeVisible();
  });

  it('renders the thumbnail image with correct alt text', () => {
    render(<FilmCard {...defaultProps} />);
    expect(screen.getByAltText('My Test Film')).toBeInTheDocument();
  });

  it('links to the correct film detail page', () => {
    render(<FilmCard {...defaultProps} />);
    const link = screen.getByTestId('film-card');
    expect(link).toHaveAttribute('href', '/film/42');
  });

  it('displays the formatted duration', () => {
    render(<FilmCard {...defaultProps} />);
    expect(screen.getByText('12:05')).toBeVisible();
  });

  it('shows a spinner before the image loads', () => {
    render(<FilmCard {...defaultProps} />);
    expect(screen.getByTestId('thumbnail-spinner')).toBeVisible();
  });

  it('hides the spinner and reveals the image after load', () => {
    render(<FilmCard {...defaultProps} />);
    const img = screen.getByAltText('My Test Film');

    fireEvent.load(img);

    expect(screen.queryByTestId('thumbnail-spinner')).not.toBeInTheDocument();
    expect(img.className).toContain('opacity-100');
  });
});

describe('formatDuration', () => {
  it('pads seconds with a leading zero', () => {
    expect(formatDuration({ minutes: 1, seconds: 5 })).toBe('1:05');
  });

  it('does not pad seconds >= 10', () => {
    expect(formatDuration({ minutes: 90, seconds: 30 })).toBe('90:30');
  });

  it('handles zero seconds', () => {
    expect(formatDuration({ minutes: 5, seconds: 0 })).toBe('5:00');
  });
});
