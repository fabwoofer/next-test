import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategorySection from './CategorySection';

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

describe('CategorySection', () => {
  it('renders the category name', () => {
    render(
      <CategorySection categoryId="7" categoryName="Drama">
        <p>films here</p>
      </CategorySection>,
    );
    expect(screen.getByText('Drama')).toBeVisible();
  });

  it('links to the correct category page', () => {
    render(
      <CategorySection categoryId="7" categoryName="Drama">
        <p>films here</p>
      </CategorySection>,
    );
    expect(screen.getByTestId('category-link')).toHaveAttribute(
      'href',
      '/category/7',
    );
  });

  it('shows "See all →" link text', () => {
    render(
      <CategorySection categoryId="7" categoryName="Drama">
        <p>films here</p>
      </CategorySection>,
    );
    expect(screen.getByText('See all →')).toBeVisible();
  });

  it('renders children', () => {
    render(
      <CategorySection categoryId="7" categoryName="Drama">
        <div data-testid="child-content">film grid</div>
      </CategorySection>,
    );
    expect(screen.getByTestId('child-content')).toBeVisible();
  });
});
