import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type{ Movie } from '../../types/movie';
import styles from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Add event listener for Escape key
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Image';

  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear()
    : 'Unknown';

  // Handle backdrop click (only on the overlay, not on the content)
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        
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
    </div>,
    document.body
  );
}