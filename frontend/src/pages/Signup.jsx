import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.signup(form);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
      <p className="text-white/40 text-sm mb-6">Start planning your dream trips</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-white/60 text-xs mb-1 block">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-3.5 text-white/30" />
            <input
              type="text"
             placeholder="John Doe"
              className="input-field !pl-14"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-white/60 text-xs mb-1 block">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3.5 text-white/30" />
            <input
              type="email"
              placeholder="you@example.com"
              className="input-field !pl-14"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-white/60 text-xs mb-1 block">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-3.5 text-white/30" />
            <input
              type="password"
              placeholder="Min 6 characters"
              className="input-field !pl-14"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2 mt-2">
          <UserPlus size={16} />
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-white/40 text-sm text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
      </p>
    </motion.div>
  );
};

export default Signup;