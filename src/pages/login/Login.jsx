import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import newRequest from '../../utils/newRequest';
import './Login.scss';

const Login = () => {
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await newRequest.post('/auth/login', form);
      dispatch({ type: 'LOGIN', payload: res.data });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      {/* Left panel */}
      <div className="auth-visual">
        <div className="visual-glow violet" />
        <div className="visual-glow cyan" />
        <div className="visual-content">
          <Link to="/" className="auth-logo">Liverr</Link>
          <blockquote>
            <p>"The best freelancers, the fastest results. Liverr changed how we build products."</p>
            <cite>— Sarah K., Product Lead at Notion</cite>
          </blockquote>
          <div className="visual-stats">
            <div><strong>12M+</strong><span>Freelancers</span></div>
            <div><strong>98%</strong><span>Satisfaction</span></div>
            <div><strong>180+</strong><span>Countries</span></div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to your Liverr account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                name="username"
                type="text"
                className="input-field"
                placeholder="your_username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="password-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2l12 12M7 3.2A7.2 7.2 0 0 1 8 3c3.3 0 6 2.7 6 5a5.6 5.6 0 0 1-.9 3M4 4.9A6 6 0 0 0 2 8c0 2.8 2.7 5 6 5a6 6 0 0 0 3.1-.9" stroke="#5c5c7a" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="8" cy="8" r="2" stroke="#5c5c7a" strokeWidth="1.5"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <ellipse cx="8" cy="8" rx="6" ry="5" stroke="#5c5c7a" strokeWidth="1.5"/>
                      <circle cx="8" cy="8" r="2" stroke="#5c5c7a" strokeWidth="1.5"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  Sign In
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Join Liverr</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;