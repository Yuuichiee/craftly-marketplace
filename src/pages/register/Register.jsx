import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import { showToast } from '../../utils/toast';
import './Register.scss';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
    img: '',
    phone: '',
    desc: '',
    isSeller: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim() || !form.password.trim() || !form.country.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await newRequest.post('/auth/register', form);
      showToast('Account created! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
      {/* Left panel */}
      <div className="auth-visual">
        <div className="visual-glow violet" />
        <div className="visual-glow pink" />
        <div className="visual-content">
          <Link to="/" className="auth-logo">GigConnect</Link>
          <div className="visual-features">
            <h2>Start your journey today</h2>
            <div className="feature-list">
              {[
                'Access 12M+ verified freelancers',
                'Post a gig in under 5 minutes',
                'Secure payments & money-back guarantee',
                'Dedicated support 24/7',
              ].map(f => (
                <div key={f} className="feature-item">
                  <span className="check-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-7" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card register-card">
          <div className="auth-header">
            <h1>Create your account</h1>
            <p>Join millions of freelancers and businesses</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-username">Username *</label>
                <input id="reg-username" name="username" type="text" className="input-field"
                  placeholder="cool_username" value={form.username} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email *</label>
                <input id="reg-email" name="email" type="email" className="input-field"
                  placeholder="you@email.com" value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password *</label>
              <div className="password-wrap">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M7 3.2A7.2 7.2 0 0 1 8 3c3.3 0 6 2.7 6 5a5.6 5.6 0 0 1-.9 3M4 4.9A6 6 0 0 0 2 8c0 2.8 2.7 5 6 5a6 6 0 0 0 3.1-.9" stroke="#5c5c7a" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="8" r="2" stroke="#5c5c7a" strokeWidth="1.5"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="8" rx="6" ry="5" stroke="#5c5c7a" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" stroke="#5c5c7a" strokeWidth="1.5"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-country">Country *</label>
                <input id="reg-country" name="country" type="text" className="input-field"
                  placeholder="e.g. United States" value={form.country} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Phone</label>
                <input id="reg-phone" name="phone" type="tel" className="input-field"
                  placeholder="+1 555 000 0000" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-img">Profile Image URL</label>
              <input id="reg-img" name="img" type="url" className="input-field"
                placeholder="https://..." value={form.img} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-desc">Bio</label>
              <textarea id="reg-desc" name="desc" className="input-field"
                placeholder="Tell clients about yourself..." value={form.desc} onChange={handleChange} rows={3} />
            </div>

            {/* Seller toggle */}
            <label className="seller-toggle" htmlFor="reg-seller">
              <input
                id="reg-seller"
                name="isSeller"
                type="checkbox"
                checked={form.isSeller}
                onChange={handleChange}
              />
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
              <div className="toggle-text">
                <span>I want to offer services on Liverr</span>
                <small>Register as a seller to create and list gigs</small>
              </div>
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  Create Account
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;