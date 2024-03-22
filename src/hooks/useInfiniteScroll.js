import {useCallback, useEffect, useState} from 'react';

const useInfiniteScroll = callback => {
  const [isFetching, setIsFetching] = useState(false);

  /** Check if the user has scrolled to the bottom of the page and if we are not already fetching new items */
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
      isFetching
    ) {
      return;
    }
    setIsFetching(true);
  }, [isFetching]);

  const fetchData = useCallback(async () => {
    await callback();
    setIsFetching(false);
  }, [callback]);

  /** Register scroll listener */
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /** Fetch the data when isFetching changes */
  useEffect(() => {
    if (isFetching) fetchData();
  }, [fetchData, isFetching]);

  return isFetching;
};

export default useInfiniteScroll;
