import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa6";
import inventoryImage from "../assets/inventory_bg.avif";
import { login } from "../utils/routes";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(login, formData, {
        withCredentials: true,
      });
      console.log("Login Successful:", response.data); // Optional debugging
      setLoading(false);
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err); // Optional debugging
      setLoading(false);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="bg-base-200 min-h-screen flex items-center justify-center">
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-4xl w-full">
        {/* Left Section with Image */}
        <figure className="lg:w-1/2">
          <img
            src={inventoryImage}
            alt="Inventory background"
            className="object-cover w-full h-full"
          />
        </figure>

        {/* Right Section with Form */}
        <div className="card-body lg:w-1/2">
          <h2 className="card-title text-2xl font-bold mb-6">Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <MdEmail />
                <input
                  type="email"
                  className="grow"
                  placeholder="email@example.com"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* Password Input */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <FaKey />
                <input
                  type="password"
                  className="grow"
                  placeholder="Enter password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* Login Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
