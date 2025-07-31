import { useState, useContext } from "react";
import { login as loginAPI } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import Logo from '../assets/Logo.svg';

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginAPI(formData);
      login(res.user, res.token);
      navigate("/maindashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-2">
      <div className="flex justify-center w-full mb-4">
        <img src={Logo} className="w-40" alt="" />
      </div>
      <h1 className="text-sm text-center text-[#7a7777] mb-4">
        <span className="font-bold">Login</span> to your account and manage your daily and weekly queues effortlessly
      </h1>
      <div className="bg-white shadow-lg p-5 rounded-lg w-72">
        <h2 className="text-2xl text-[#424242] font-bold mb-5 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right text-sm">
            <Link to="/forgotpassword" className="text-[#1FBEC3] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1FBEC3] text-white text-sm py-1.5 cursor-pointer rounded hover:bg-[#477f81] flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <p className="text-sm text-center text-[#4b4949]">
            No account?{" "}
            <Link to="/signup" className="text-[#1FBEC3] hover:underline">
              Sign up
            </Link>
          </p>
        </form>
        <div className="flex flex-col justify-center items-center w-full mt-4">
        <h1 className="text-xs text-[#363636] font-bold mb-2">Demo Accounts - Admin & User</h1>
        <p className="text-sm text-[#525252]">mern.dev@gmail.com -- mern123</p>
        <p className="text-sm text-[#525252]">khutso@gmail.com -- Khutso123</p>
        </div>
      </div>
        <footer>
        <p className="text-[#686666] text-sm mt-5">
          &copy; {new Date().getFullYear()} QueueCare. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
