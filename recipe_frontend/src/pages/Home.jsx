import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import RecipeCard from '../components/RecipeCard';

// PUBLIC_INTERFACE
export default function Home({ isAuthenticated }) {
  /** Home page: list recipes with search and pagination. */
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [recipes, setRecipes] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = parseInt(params.get('page') || '1', 10);
  const q = params.get('q') || '';

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      const res = await api.listRecipes({ page, limit: 12, search: q });
      if (!ignore) {
        if (res.ok) {
          const data = res.data || {};
          // Expecting { items, page, limit, total } but fallback to array
          if (Array.isArray(data)) {
            setRecipes(data);
            setMeta({ page, limit: 12, total: data.length });
          } else {
            setRecipes(data.items || []);
            setMeta({ page: data.page || page, limit: data.limit || 12, total: data.total || (data.items || []).length });
          }
        } else {
          setError(res.data?.message || 'Failed to load recipes');
        }
        setLoading(false);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [page, q]);

  const nextPage = () => {
    const p = page + 1;
    const search = new URLSearchParams();
    search.set('page', String(p));
    if (q) search.set('q', q);
    navigate({ pathname: '/', search: search.toString() });
  };
  const prevPage = () => {
    const p = Math.max(1, page - 1);
    const search = new URLSearchParams();
    search.set('page', String(p));
    if (q) search.set('q', q);
    navigate({ pathname: '/', search: search.toString() });
  };

  return (
    <div className="container">
      <div className="top-actions">
        <h1 className="page-title">Discover Recipes</h1>
        {isAuthenticated && (
          <Link to="/recipes/create" className="btn btn-secondary">Create Recipe</Link>
        )}
      </div>

      {loading && <div className="skeleton">Loading recipes...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid">
            {recipes.map((r) => <RecipeCard key={r.id || r._id} recipe={r} />)}
          </div>
          <div className="pagination">
            <button className="btn btn-outline" onClick={prevPage} disabled={page <= 1}>Previous</button>
            <span className="muted">Page {meta.page}</span>
            <button className="btn btn-outline" onClick={nextPage} disabled={(meta.total && meta.items?.length < meta.limit) ? true : false}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
