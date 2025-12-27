import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import type { AxiosError } from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/nice");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error(axiosError.response?.data);
      alert(axiosError.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-500 mx-100 m-12 rounded p-12 gap-5">
      <h1 className="text-3xl text-white font-semibold">
        Log in Ore No Pocket
      </h1>
      <hr className="w-50 border-gray-300 py-2" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full gap-5"
      >
        <input
          className="bg-gray-200 p-3 rounded w-80"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          className="bg-gray-200 p-3 rounded w-80"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button
          className="bg-gray-950 text-white p-3 rounded px-7 w-80 hover:bg-gray-800 transition"
          type="submit"
        >
          Sign in
        </button>
        <p className="text-gray-800">
          No account yet?{" "}
          <Link to="/signup" className="text-blue-200 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
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
        Sign in with Google
      </button>
    </div>
  );
}
