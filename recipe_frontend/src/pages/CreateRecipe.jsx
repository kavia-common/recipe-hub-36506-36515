import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import RecipeForm from '../components/RecipeForm';

// PUBLIC_INTERFACE
export default function CreateRecipe() {
  /** Protected page: Create a new recipe. */
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError(null);
    const res = await api.createRecipe(payload);
    setSubmitting(false);
    if (res.ok) {
      const id = res.data?.id || res.data?._id;
      navigate(id ? `/recipes/${id}` : '/');
    } else {
      setError(res.data?.message || 'Failed to create recipe');
    }
  };

  return (
    <div className="container narrow">
      <h1 className="page-title">Create Recipe</h1>
      <RecipeForm onSubmit={handleSubmit} submitting={submitting} error={error} />
    </div>
  );
}
