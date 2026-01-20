import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const { data } = await api.post("/api/admin/login", {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setToken(data.token);

        toast.success("Login successful");
        // redirect handled by App.jsx route guard
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to login. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-50">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Panel Login
        </h1>

        <form onSubmit={onSubmitHandler}>
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black"
              type="email"
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full py-2 px-4 rounded-md text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
