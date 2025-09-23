import type{ Movie } from '../../types/movie';
import MovieCard from '../MovieCard/MovieCard';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <div className={styles.movieGrid}>
      {movies.map(movie => (
        <div key={movie.id} onClick={() => onSelect(movie)} className={styles.movieItem}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}