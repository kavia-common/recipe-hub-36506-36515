import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export default function Navbar({ isAuthenticated, onLogout, onSearch }) {
  /** Top navigation with search and auth controls. */
  const location = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const showSearch = useMemo(() => {
    return location.pathname === '/' || location.pathname.startsWith('/recipes');
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get('q') || '';
    setQ(s);
  }, [location.search]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(q);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    navigate({ pathname: '/', search: params.toString() });
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Recipe Hub</Link>
        {showSearch && (
          <form className="search" onSubmit={submitSearch}>
            <input
              aria-label="Search recipes"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search recipes..."
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        )}
      </div>
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <Link to="/recipes/create" className="btn btn-secondary">+ Create</Link>
            <button className="btn btn-outline" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline" to="/login">Login</Link>
            <Link className="btn btn-primary" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
