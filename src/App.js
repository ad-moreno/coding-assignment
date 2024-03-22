import {useCallback, useState} from 'react';
import {Routes, Route, createSearchParams, useSearchParams, useNavigate} from 'react-router-dom';
import 'reactjs-popup/dist/index.css';
import Header from './components/Header';
import Movies from './components/Movies';
import Starred from './components/Starred';
import WatchLater from './components/WatchLater';
import YouTubePlayer from './components/YoutubePlayer';
import './app.scss';
import Modal from './components/Modal';
import useInfiniteScroll from './hooks/useInfiniteScroll';
import {getMovie, useMovies} from './content/movies';

const App = () => {
  const {movies, loadNextPage} = useMovies();
  const [, setSearchParams] = useSearchParams();
  const [videoKey, setVideoKey] = useState();
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  const closeModal = () => setOpen(false);

  const closeCard = () => {};

  const handleMovieSearch = query => {
    navigate('/');
    if (query.length > 0) setSearchParams(createSearchParams({search: query}));
    else setSearchParams(createSearchParams({}));
  };

  useInfiniteScroll(loadNextPage);

  const fetchMovie = useCallback(async id => {
    setVideoKey(null);
    const videoData = await getMovie(id);
    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(vid => vid.type === 'Trailer');
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  }, []);

  const viewTrailer = useCallback(
    movie => {
      fetchMovie(movie.id);
      if (!videoKey) setOpen(true);
      setOpen(true);
    },
    [fetchMovie, videoKey]
  );

  return (
    <div className="App">
      <Header onSearch={handleMovieSearch} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Movies movies={movies} viewTrailer={viewTrailer} closeCard={closeCard} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <YouTubePlayer videoKey={videoKey} />
      </Modal>
    </div>
  );
};

export default App;
