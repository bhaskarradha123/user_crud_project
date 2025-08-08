import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/AuthService";
import "../styles/RegisterStyle.css";

export default function RegisterForm() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    role: "USER",
    mobile: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(" Registration failed.");
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `https://user-crud-backend-53a3.onrender.com/oauth2/authorization/${provider}`;
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>

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
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>

        <p className="register-login-link">
          Already registered? <Link to="/login">Login here</Link>
        </p>

        <div className="oauth-section">
          <p>Or register with:</p>
          <button className="google-btn" onClick={() => handleOAuth("google")}>
            Google
          </button>
          <button className="github-btn" onClick={() => handleOAuth("github")}>
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
