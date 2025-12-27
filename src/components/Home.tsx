import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to <span className="text-gray-700 italic">OreNoPocket</span> !
      </h1>
      <p className="text-gray-700 mb-10 text-center max-w-md">
        A little app to manage your finances, track expenses and incomes, and stay organized
        easily.
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-3 bg-sky-900 text-white font-semibold rounded-lg hover:bg-sky-950 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Home;
