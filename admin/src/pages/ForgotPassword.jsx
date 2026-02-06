import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const { data } = await api.post("/api/admin/forgot-password", {
        email,
      });

      if (data.success) {
        setSubmitted(true);
        toast.success(data.message || "Reset link sent");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to send reset link. Try again."
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
          <h1 className="text-3xl mb-3 text-[#333] font-serif" style={{ fontFamily: 'Prata, serif' }}>
            Forgot Password
          </h1>
          <p className="text-gray-500 text-sm tracking-wide">
            Enter your email to receive a reset link
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={onSubmitHandler} className="space-y-6">
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-lg text-white font-medium text-sm tracking-wide uppercase shadow-lg transform transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
             </div>
             <p className="text-gray-600">
               If an account exists for <b>{email}</b>, you will receive a password reset link shortly.
             </p>
             <button
               onClick={() => {
                 setSubmitted(false);
                 setEmail("");
               }}
               className="text-indigo-600 hover:underline text-sm font-medium mt-4"
             >
               Resend Link
             </button>
          </div>
        )}

        <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
