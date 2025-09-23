import type{ Movie } from '../../types/movie';
import styles from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Image';

  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear()
    : 'Unknown';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalHeader}>
          <img src={backdropUrl} alt={movie.title} className={styles.backdrop} />
          <div className={styles.movieInfo}>
            <h2 className={styles.title}>{movie.title}</h2>
            <p className={styles.year}>Year: {releaseYear}</p>
            <p className={styles.rating}>Rating: {movie.vote_average.toFixed(1)}/10</p>
          </div>
        </div>
        
        <div className={styles.modalBody}>
          <h3>Overview</h3>
          <p className={styles.overview}>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}