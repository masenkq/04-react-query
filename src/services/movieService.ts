import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MoviesResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

if (!API_TOKEN) {
    throw new Error('VITE_TMDB_TOKEN is not defined in environment variables');
}

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${API_TOKEN}`,
    },
});

export const fetchMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
    if (!query.trim()) {
        return {
            page: 1,
            results: [],
            total_pages: 0,
            total_results: 0
        };
    }

    const response = await axiosInstance.get<MoviesResponse>('/search/movie', {
        params: {
            query: query.trim(),
            page,
        },
    });
    return response.data;
};