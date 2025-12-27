// src/components/Nice.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

const Nice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState<string>("User");

  useEffect(() => {
    let token = localStorage.getItem("token");

    const params = new URLSearchParams(location.search);
    if (params.get("token")) {
      token = params.get("token")!;
      localStorage.setItem("token", token)};

    if (!token) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.firstname || res.data.username);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/");
      }
    };

    fetchUser();
  }, [location.search, navigate])


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">
        Welcome {name}, you’re signed in!
      </h1>
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Nice;
