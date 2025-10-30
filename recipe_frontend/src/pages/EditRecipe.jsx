import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import RecipeForm from '../components/RecipeForm';

// PUBLIC_INTERFACE
export default function EditRecipe() {
  /** Protected page: Edit an existing recipe. */
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      const res = await api.getRecipe(id);
      if (!ignore) {
        if (res.ok) setInitial(res.data);
        else setError(res.data?.message || 'Failed to load recipe');
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError(null);
    const res = await api.updateRecipe(id, payload);
    setSubmitting(false);
    if (res.ok) {
      navigate(`/recipes/${id}`);
    } else {
      setError(res.data?.message || 'Failed to update recipe');
    }
  };

  if (loading) return <div className="container"><div className="skeleton">Loading...</div></div>;
  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!initial) return null;

  return (
    <div className="container narrow">
      <h1 className="page-title">Edit Recipe</h1>
      <RecipeForm initialValues={initial} onSubmit={handleSubmit} submitting={submitting} error={error} />
    </div>
  );
}
