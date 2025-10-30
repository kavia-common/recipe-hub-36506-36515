import { useEffect, useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export default function RecipeForm({ initialValues, onSubmit, submitting = false, error = null }) {
  /**
   * Form for creating/editing a recipe.
   * Fields: title, description, ingredients (newline separated), steps (newline separated), tags (comma separated)
   */
  const [values, setValues] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    tags: '',
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title || '',
        description: initialValues.description || '',
        ingredients: (initialValues.ingredients || []).join('\n'),
        steps: (initialValues.steps || []).join('\n'),
        tags: Array.isArray(initialValues.tags) ? initialValues.tags.join(', ') : (initialValues.tags || ''),
      });
    }
  }, [initialValues]);

  const errors = useMemo(() => {
    const e = {};
    if (!values.title.trim()) e.title = 'Title is required';
    if (!values.description.trim()) e.description = 'Description is required';
    if (!values.ingredients.trim()) e.ingredients = 'Ingredients are required';
    if (!values.steps.trim()) e.steps = 'Steps are required';
    return e;
  }, [values]);

  const handleChange = (e) => {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      setTouched({ title: true, description: true, ingredients: true, steps: true, tags: true });
      return;
    }
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      ingredients: values.ingredients.split('\n').map(s => s.trim()).filter(Boolean),
      steps: values.steps.split('\n').map(s => s.trim()).filter(Boolean),
      tags: values.tags.split(',').map(s => s.trim()).filter(Boolean),
    };
    onSubmit && onSubmit(payload);
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-error">{typeof error === 'string' ? error : (error.message || 'An error occurred')}</div>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input name="title" id="title" value={values.title} onChange={handleChange} onBlur={handleBlur} placeholder="e.g., Creamy Tomato Pasta" />
        {touched.title && errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" rows={3} value={values.description} onChange={handleChange} onBlur={handleBlur} placeholder="Brief summary" />
        {touched.description && errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ingredients">Ingredients (one per line)</label>
          <textarea name="ingredients" id="ingredients" rows={8} value={values.ingredients} onChange={handleChange} onBlur={handleBlur} placeholder="2 cups flour&#10;1 tsp salt" />
          {touched.ingredients && errors.ingredients && <span className="error">{errors.ingredients}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="steps">Steps (one per line)</label>
          <textarea name="steps" id="steps" rows={8} value={values.steps} onChange={handleChange} onBlur={handleBlur} placeholder="Mix dry ingredients&#10;Add water" />
          {touched.steps && errors.steps && <span className="error">{errors.steps}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (comma separated)</label>
        <input name="tags" id="tags" value={values.tags} onChange={handleChange} onBlur={handleBlur} placeholder="vegan, quick, dinner" />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
