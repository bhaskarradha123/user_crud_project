import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/AuthService';
import '../styles/RegisterStyle.css';

export default function LoginForm() {
  const [form, setForm] = useState({
    userName: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      alert(' Login successful!');
      const { token, role } = res;

      // Save JWT
      localStorage.setItem('token', token);

      // Navigate
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      console.error(err);
      alert(' Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `https://user-crud-backend-53a3.onrender.com/auth/oauth2/authorization/${provider}`;
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="email"
            name="userName"
            placeholder="Email"
            value={form.userName}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="register-login-link">
          Don&apos;t have an account? <Link to="/">Register here</Link>
        </p>

        <div className="oauth-section">
          <p>Or login with:</p>
          <div className="oauth-buttons">
            <button className="google-btn" onClick={() => handleOAuth('google')}>
              <i className="fab fa-google"></i> Google
            </button>
            <button className="github-btn" onClick={() => handleOAuth('github')}>
              <i className="fab fa-github"></i> GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
