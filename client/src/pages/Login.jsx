import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import AuthLayout from "../components/AuthLayout.jsx";
import FormInput from "../components/FormInput.jsx";
import { login } from "../features/auth/authSlice.js";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name}`);
      navigate("/");
    } else {
      toast.error(result.payload || "Login failed. Please try again.");
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Pick up right where the credits rolled.">
      <form onSubmit={handleSubmit} noValidate>
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
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-cine-gold hover:bg-cine-goldSoft text-cine-bg font-semibold
            py-2.5 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-cine-muted text-center">
        New to MovieSphere?{" "}
        <Link to="/register" className="text-cine-gold hover:text-cine-goldSoft font-medium">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
