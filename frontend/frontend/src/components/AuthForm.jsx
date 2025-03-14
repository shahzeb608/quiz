import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp, logIn } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/auth-form.css";  

const AuthForm = ({ isSignup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(signUp(formData)).then(() => navigate("/"));
    } else {
      dispatch(logIn({ email: formData.email, password: formData.password })).then(() => navigate("/"));
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {isSignup && (
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        )}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AuthForm;
