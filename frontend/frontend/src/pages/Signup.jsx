import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../features/auth/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signUp(formData));
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" disabled={status === "loading"}>Sign Up</button>
      </form>
      {status === "loading" && <p>Signing up...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Signup;
