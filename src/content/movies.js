import {useQuery} from '@tanstack/react-query';
import {API_KEY, ENDPOINT, ENDPOINT_DISCOVER, ENDPOINT_SEARCH} from '../constants';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useDebounce} from 'use-debounce';

const fetchMovies = async apiUrl => {
  const response = await fetch(apiUrl);
  return response.json();
};

export const getMovie = id => fetchMovies(`${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`);

const SEARCH_MOVIES_MAIN_KEY = 'search';
const useSearchMoviesQuery = (query, page = 1, options = {}) =>
  useQuery({
    queryKey: [SEARCH_MOVIES_MAIN_KEY, query, page],
    queryFn: () => fetchMovies(`${ENDPOINT_SEARCH}&query=${query}&page=${page}`),
    ...options,
  });

const DISCOVER_MOVIES_MAIN_KEY = 'discover';
const useDiscoverMoviesQuery = (page = 1, options = {}) =>
  useQuery({
    queryKey: [DISCOVER_MOVIES_MAIN_KEY, page],
    queryFn: () => fetchMovies(`${ENDPOINT_DISCOVER}&page=${page}`),
    ...options,
  });

const MovieModes = {
  SEARCH: 'search',
  DISCOVER: 'discover',
};

export const useMovies = () => {
  const [mode, setMode] = useState(null);
  const [movies, setMovies] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPagesRef = useRef(Infinity);

  const [searchParams] = useSearchParams();
  const [search] = useDebounce(searchParams.get('search'), 500);

  /** Switch between modes depending on "search" search parameter */
  useEffect(() => {
    if (search) setMode(MovieModes.SEARCH);
    else setMode(MovieModes.DISCOVER);
    setCurrentPage(1);
  }, [search]);

  const searchQuery = useSearchMoviesQuery(search ?? '', currentPage, {enabled: mode === MovieModes.SEARCH});
  const discoverQuery = useDiscoverMoviesQuery(currentPage, {enabled: mode === MovieModes.DISCOVER});

  const currentQuery = mode === MovieModes.SEARCH ? searchQuery : discoverQuery;

  /** Update the page if we have not reached the end */
  const loadNextPage = useCallback(() => {
    if (totalPagesRef.current === currentPage) return;
    if (currentQuery.isSuccess) setCurrentPage(v => v + 1);
  }, [currentPage, currentQuery.isSuccess]);

  /** Update the data from the query */
  useEffect(() => {
    if (!currentQuery.data) return;

    if (currentPage > 1) setMovies(v => [...v, ...currentQuery.data.results]);
    else setMovies(currentQuery.data.results);

    totalPagesRef.current = currentQuery.data.total_pages;
  }, [currentPage, currentQuery.data]);

  return {loadNextPage, movies};
};
