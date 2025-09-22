import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import styles from './App.module.css';

function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSearch = async (query: string) => {
        setLoading(true);
        setError(false);
        setMovies([]);
        setSelectedMovie(null);
        
        try {
            const data = await fetchMovies(query);
            
            if (data.results.length === 0) {
                import('react-hot-toast').then(({ toast }) => {
                    toast.error('No movies found for your request.');
                });
            }
            
            setMovies(data.results);
        } catch (error) {
            setError(true);
            import('react-hot-toast').then(({ toast }) => {
                toast.error('Failed to fetch movies. Please try again.');
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    return (
        <div className={styles.app}>
            <Toaster position="top-center" />
            <SearchBar onSubmit={handleSearch} />
            
            <main className={styles.main}>
                {loading && <Loader />}
                {error && <ErrorMessage />}
                {!loading && !error && movies.length > 0 && (
                    <MovieGrid movies={movies} onSelect={handleSelectMovie} />
                )}
            </main>

            <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        </div>
    );
}

export default App;