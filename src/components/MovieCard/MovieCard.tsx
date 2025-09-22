import { Movie } from '../../types/movie';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear()
    : 'Unknown';

  return (
    <div className={styles.movieCard}>
      <img 
        src={posterUrl} 
        alt={movie.title}
        className={styles.poster}
      />
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.year}>Year: {releaseYear}</p>
        <p className={styles.rating}>Rating: {movie.vote_average.toFixed(1)}</p>
        <p className={styles.overview}>{movie.overview.substring(0, 150)}...</p>
      </div>
    </div>
  );
}