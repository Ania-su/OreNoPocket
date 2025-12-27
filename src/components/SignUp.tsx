import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import type { AxiosError } from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    birthdate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    if (password.length < minLength)
      return "Password must be at least 8 characters long.";
    if (!hasUpperCase)
      return "Password must contain at least one uppercase letter.";
    if (!hasLowerCase)
      return "Password must contain at least one lowercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecial)
      return "Password must contain at least one special character (!@#$%^&*).";

    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setErrors({ ...errors, password: passwordError });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    try {
      await api.post("/auth/signup", form);
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      navigate("/login");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error(axiosError.response?.data);
      alert(axiosError.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <div className="flex flex-col gap-3 justify-center items-center rounded p-12 bg-gray-500 mx-90 m-12">
      <h1 className="text-3xl text-white font-semibold">
        Sign Up Ore No Pocket
      </h1>
      <hr className="w-80 border-gray-300 py-2"/>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex gap-3">
          <input
            className="bg-gray-200 p-3 rounded"
            name="firstname"
            placeholder="First name"
            onChange={handleChange}
          />
          <input
            className="bg-gray-200 p-3 rounded"
            name="lastname"
            placeholder="Last name"
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-3">
          <input
            className="bg-gray-200 p-3 rounded"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            className="bg-gray-200 p-3 rounded w-68 outline-none"
            name="birthdate"
            type="date"
            placeholder="Birthday"
            onChange={handleChange}
          />
        </div>
        <input
          className="bg-gray-200 p-3 rounded"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <div className="flex gap-3">
          <input
            className="bg-gray-200 p-3 rounded"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <input
            className="bg-gray-200 p-3 rounded"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-gray-950 text-white p-3 rounded px-7"
        >
          Sign Up
        </button>
      </form>
      <p className="text-gray-800 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-200 hover:underline">
          Sign In
        </Link>
      </p>
      <button
        onClick={() => {
          window.location.href = "http://localhost:3001/api/auth/google";
        }}
        className="flex items-center justify-center gap-3 w-70 bg-white border border-gray-300 py-3 my-3  rounded-xl font-semibold text-gray-700 shadow-md hover:shadow-lg transition"
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.3 0 6.2 1.1 8.5 3.2l6.3-6.3C34.9 2.5 29.8 0 24 0 14.6 0 6.4 5.8 2.4 14.2l7.7 6c2-6 7.6-10.7 13.9-10.7z"
          />
          <path
            fill="#4285F4"
            d="M46.1 24.5c0-1.5-.1-2.6-.4-3.8H24v7.2h12.7c-.6 3.1-2.3 5.7-4.9 7.5l7.6 5.9c4.5-4.2 7.1-10.4 7.1-16.8z"
          />
          <path
            fill="#FBBC05"
            d="M9.4 28.2c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.7-6c-1.6 3.2-2.5 6.8-2.5 10.7s.9 7.5 2.5 10.7l7.7-6z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.5 0 11.9-2.1 15.9-5.7l-7.6-5.9c-2.1 1.4-4.8 2.2-8.3 2.2-6.3 0-11.6-4.3-13.6-10.1l-7.7 6C6.4 42.2 14.6 48 24 48z"
          />
        </svg>
        Continuer avec Google
      </button>
    </div>
  );
}
