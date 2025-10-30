import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import EditRecipe from './pages/EditRecipe';
import Login from './pages/Login';
import Register from './pages/Register';

function AppShell() {
  const [theme, setTheme] = useState('light');
  const [authState, setAuthState] = useState(() => {
    try {
      return {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || 'null')
      };
    } catch {
      return { token: null, user: null };
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const isAuthenticated = useMemo(() => Boolean(authState.token), [authState.token]);

  // Keep authState in sync with storage when pages (login/register) update storage directly
  useEffect(() => {
    const onStorage = () => {
      setAuthState({
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || 'null')
      });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const onLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {
      // ignore
    }
    setAuthState({ token: null, user: null });
  };

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // When navigating to create/edit, ensure protected
    if ((location.pathname === '/recipes/create' || location.pathname.endsWith('/edit')) && !isAuthenticated) {
      navigate('/login');
    }
  }, [location.pathname, isAuthenticated, navigate]);

  return (
    <div className="App">
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        onSearch={() => {}}
      />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/recipes/:id" element={<RecipeDetail currentUser={authState.user} token={authState.token} />} />
          <Route path="/recipes/create" element={isAuthenticated ? <CreateRecipe /> : <Navigate to="/login" replace />} />
          <Route path="/recipes/:id/edit" element={isAuthenticated ? <EditRecipe /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <button
        className="theme-toggle"
        onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root application with router. */
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
