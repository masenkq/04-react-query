import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import SearchBar from '../SearchBar/SearchBar';
import MovieList from '../MovieList/MovieList';
import { fetchMovies } from '../../services/movieService';
import styles from './App.module.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

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
    staleTime: 5 * 60 * 1000, // 5 minutes
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

  const movies = moviesData?.results || [];
  const totalPages = moviesData?.total_pages || 0;

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      
      <main className={styles.main}>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            {isFetching && (
              <div className={styles.loading}>Updating...</div>
            )}
            <MovieList movies={movies} />
            
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
      </main>
    </div>
  );
}