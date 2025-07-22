import { useState } from "react";
import { forgotPassword } from "../services/api";
import { MdOutlineEmail } from "react-icons/md";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await forgotPassword({ email });
      setMessage(res.message || "Password reset link sent to your email.");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-md w-80">
        <h2 className="text-2xl font-semibold mb-5 text-center text-gray-700">
          Forgot Password
        </h2>

        {message && (
          <p className="text-green-600 text-sm text-center mb-2">{message}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center px-3 py-2 border border-gray-300 rounded">
            <MdOutlineEmail className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1FBEC3] text-white text-sm cursor-pointer py-1.5 rounded hover:bg-[#477f81] flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <p className="text-sm text-center text-gray-600">
            Remembered password?{" "}
            <Link to="/login" className="text-[#1FBEC3] hover:underline">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
