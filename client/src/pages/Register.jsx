import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import AuthLayout from "../components/AuthLayout.jsx";
import FormInput from "../components/FormInput.jsx";
import { register } from "../features/auth/authSlice.js";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Must be at least 6 characters";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success(`Welcome to MovieSphere, ${result.payload.user.name}`);
      navigate("/");
    } else {
      toast.error(result.payload || "Registration failed. Please try again.");
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="One account, every screening room.">
      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Name"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <FormInput
          label="Confirm password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-cine-gold hover:bg-cine-goldSoft text-cine-bg font-semibold
            py-2.5 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-cine-muted text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-cine-gold hover:text-cine-goldSoft font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
