import FilmCard, { FilmCardProps } from './FilmCard';

interface FilmGridProps {
  films: FilmCardProps[];
}

export default function FilmGrid({ films }: FilmGridProps) {
  return (
    <div
      className="grid grid-cols-2 gap-4 lg:grid-cols-3"
      data-testid="film-grid"
    >
      {films.map((film) => (
        <FilmCard key={film.id} {...film} />
      ))}
    </div>
  );
}
