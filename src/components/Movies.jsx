import Movie from './Movie';
import '../styles/movies.scss';

const Movies = ({movies, viewTrailer, closeCard}) => {
  return (
    <div className="container" data-testid="movies">
      {movies.map(movie => {
        return <Movie movie={movie} key={`movie-${movie.id}`} viewTrailer={viewTrailer} closeCard={closeCard} />;
      })}
    </div>
  );
};

export default Movies;
