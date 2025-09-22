import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import styles from './MovieModal.module.css';

interface MovieModalProps {
    movie: Movie | null;
    onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
    useEffect(() => {
        if (!movie) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [movie, onClose]);

    if (!movie) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
            <div className={styles.modal}>
                <button 
                    className={styles.closeButton} 
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    &times;
                </button>
                <img
                    src={movie.backdrop_path 
                        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                        : 'https://via.placeholder.com/1280x720?text=No+Image'
                    }
                    alt={movie.title}
                    className={styles.image}
                />
                <div className={styles.content}>
                    <h2>{movie.title}</h2>
                    <p>{movie.overview}</p>
                    <p>
                        <strong>Release Date:</strong> {movie.release_date}
                    </p>
                    <p>
                        <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}