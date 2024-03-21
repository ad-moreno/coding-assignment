import {Link, NavLink, useSearchParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

import '../styles/header.scss';

const Header = ({onSearch}) => {
  const {starredMovies} = useSelector(state => state.starred);
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('search') ?? '';

  return (
    <header>
      <Link to="/" data-testid="home" onClick={() => onSearch('')}>
        <i className="bi bi-film" />
      </Link>

      <nav>
        <NavLink to="/starred" data-testid="nav-starred" className="nav-starred">
          {starredMovies.length > 0 ? (
            <>
              <i className="bi bi-star-fill bi-star-fill-white" />
              <sup className="star-number">{starredMovies.length}</sup>
            </>
          ) : (
            <i className="bi bi-star" />
          )}
        </NavLink>
        <NavLink to="/watch-later" className="nav-fav" data-testid="watch-later-link">
          watch later
        </NavLink>
      </nav>

      <div className="input-group rounded">
        <Link to="/" onClick={e => onSearch('')} className="search-link">
          <input
            type="search"
            data-testid="search-movies"
            value={searchText}
            onChange={e => onSearch(e.target.value)}
            className="form-control rounded"
            placeholder="Search movies..."
            aria-label="Search movies"
            aria-describedby="search-addon"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
