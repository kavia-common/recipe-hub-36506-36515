import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function RecipeDetail({ currentUser, token }) {
  /** Shows a single recipe; owner can edit/delete. */
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const isOwner = useMemo(() => {
    if (!currentUser || !recipe) return false;
    const ownerId = recipe.author?.id || recipe.author_id || recipe.user_id;
    return ownerId && (ownerId === currentUser.id || ownerId === currentUser._id);
  }, [currentUser, recipe]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      const res = await api.getRecipe(id);
      if (!ignore) {
        if (res.ok) setRecipe(res.data);
        else setError(res.data?.message || 'Failed to load recipe');
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id]);

  const deleteRecipe = async () => {
    if (!window.confirm('Delete this recipe?')) return;
    setDeleting(true);
    const res = await api.deleteRecipe(id);
    setDeleting(false);
    if (res.ok) {
      navigate('/');
    } else {
      alert(res.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <div className="container"><div className="skeleton">Loading recipe...</div></div>;
  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!recipe) return <div className="container"><div className="alert">Recipe not found.</div></div>;

  const tags = Array.isArray(recipe.tags) ? recipe.tags : (typeof recipe.tags === 'string' ? recipe.tags.split(',').map(t => t.trim()) : []);
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const steps = Array.isArray(recipe.steps) ? recipe.steps : [];

  return (
    <div className="container">
      <div className="detail-header">
        <h1 className="page-title">{recipe.title}</h1>
        {isOwner && (
          <div className="detail-actions">
            <Link to={`/recipes/${id}/edit`} className="btn btn-secondary">Edit</Link>
            <button onClick={deleteRecipe} disabled={deleting} className="btn btn-danger">{deleting ? 'Deleting...' : 'Delete'}</button>
          </div>
        )}
      </div>
      <p className="lead">{recipe.description}</p>

      {tags.length > 0 && (
        <div className="tags">
          {tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      )}

      <div className="detail-grid">
        <section>
          <h2>Ingredients</h2>
          <ul className="list">
            {ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
          </ul>
        </section>
        <section>
          <h2>Steps</h2>
          <ol className="list number">
            {steps.map((st, idx) => <li key={idx}>{st}</li>)}
          </ol>
        </section>
      </div>
    </div>
  );
}
