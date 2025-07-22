import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/api";
import { CiLock } from "react-icons/ci";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await resetPassword(token, formData.password);
      setSuccess("Password reset successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-lg w-80">
        <h2 className="text-2xl text-[#424242] font-bold mb-5 text-center">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="flex items-center px-3 py-1.5 border border-gray-300 rounded">
            <CiLock className="text-gray-500 mr-1.5" />
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full text-sm focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center px-3 py-1.5 border border-gray-300 rounded">
            <CiLock className="text-gray-500 mr-1.5" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full text-sm focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1FBEC3] text-white py-1.5 text-sm rounded hover:bg-[#1FBEC3] flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
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
              "Reset Password"
            )}
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
}
