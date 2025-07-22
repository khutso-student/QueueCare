import { useState, useContext } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { RiUser6Line } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";

export default function Signup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signup(formData);
      login(res.user, res.token);
      navigate("/maindashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-5 rounded-lg w-72">
        <h2 className="text-2xl text-[#424242] font-bold mb-5 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="flex items-center px-3 py-1.5 border border-gray-300 rounded">
            <RiUser6Line className="text-gray-500 mr-1.5" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-sm focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center px-3 py-1.5 border border-gray-300 rounded">
            <MdOutlineEmail className="text-gray-500 mr-1.5" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-sm focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center px-3 py-1.5 border border-gray-300 rounded">
            <CiLock className="text-gray-500 mr-1.5" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full text-sm focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1FBEC3] text-white text-sm py-1.5 cursor-pointer rounded hover:bg-[#477f81] flex justify-center items-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Link */}
          <p className="text-sm text-center text-[#4b4949]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1FBEC3] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
