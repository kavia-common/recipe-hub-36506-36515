import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form to authenticate and store token+user in localStorage. */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await api.login(email, password);
    setSubmitting(false);
    if (res.ok) {
      const { token, user } = res.data || {};
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } else {
      setError(res.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="container auth">
      <div className="auth-card">
        <h1 className="page-title">Welcome back</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="pw">Password</label>
            <input id="pw" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Signing in...' : 'Login'}</button>
          </div>
        </form>
        <p className="muted">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
