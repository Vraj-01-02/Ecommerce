import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-50 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-[40%] h-[40%] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl px-10 py-12 max-w-md w-full z-10 border border-white/50">
        <div className="text-center mb-10">
          <h1 className="text-4xl mb-3 text-[#333] font-serif" style={{ fontFamily: 'Prata, serif' }}>
            Admin Panel
          </h1>
          <p className="text-gray-500 text-sm tracking-wide uppercase">
            Sign in to manage your store
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all duration-300"
              type="email"
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all duration-300"
              type="password"
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end mt-1">
              <Link 
                to="/admin/forgot-password" 
                className="text-xs text-gray-500 hover:text-indigo-600 hover:underline transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-lg text-white font-medium text-sm tracking-wide uppercase shadow-lg transform transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Fabric Clothing. All rights reserved.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
