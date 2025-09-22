import type{ Movie } from '../../types/movie';
import styles from './MovieCard.module.css';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const imageUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <div className={styles.card}>
            <img 
                src={imageUrl} 
                alt={movie.title}
                className={styles.image}
            />
            <div className={styles.content}>
                <h3 className={styles.title}>{movie.title}</h3>
                <p className={styles.overview}>{movie.overview.substring(0, 100)}...</p>
                <div className={styles.details}>
                    <span className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</span>
                    <span className={styles.year}>{new Date(movie.release_date).getFullYear()}</span>
                </div>
            </div>
        </div>
    );
}