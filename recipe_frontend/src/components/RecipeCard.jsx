import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function RecipeCard({ recipe }) {
  /** Displays a recipe summary card. */
  const { id, title, description, tags = [], author = {} } = recipe || {};
  const tagList = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

  return (
    <div className="card">
      <div className="card-body">
        <Link to={`/recipes/${id}`} className="card-title">{title}</Link>
        <p className="card-text">{description}</p>
        {tagList.length > 0 && (
          <div className="tags">
            {tagList.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
      </div>
      <div className="card-footer">
        <span className="muted">by {author?.name || 'Unknown'}</span>
        <Link to={`/recipes/${id}`} className="btn btn-sm btn-outline">View</Link>
      </div>
    </div>
  );
}
