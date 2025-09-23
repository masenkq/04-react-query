import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { fetchMovies } from '../../services/movieService';
import type{ Movie } from '../../types/movie';
import styles from './App.module.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: moviesData,
    isLoading,
    isError,
    error,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery.trim(),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  // Show error toast if query fails
  useEffect(() => {
    if (isError) {
      toast.error('An error occurred while searching for movies.');
      console.error('Error fetching movies:', error);
    }
  }, [isError, error]);

  // Show no results message after successful query
  useEffect(() => {
    if (isSuccess && moviesData && moviesData.results.length === 0 && searchQuery.trim()) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, moviesData, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const movies = moviesData?.results || [];
  const totalPages = moviesData?.total_pages || 0;

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      
      <main className={styles.main}>
        {isLoading && !moviesData ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage message="Failed to load movies. Please try again." />
        ) : (
          <>
            {isFetching && movies.length > 0 && <Loader />}
            
            <MovieGrid movies={movies} onSelect={handleMovieSelect} />
            
            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                forcePage={page - 1}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                nextLabel="→"
                previousLabel="←"
                breakLabel="..."
              />
            )}
          </>
        )}
        
        {isModalOpen && selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </main>
    </div>
  );
}