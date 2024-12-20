import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import {requestApi} from '../utils/routes'
import axios from 'axios';
import {toast} from 'react-toastify'
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);    
    try {
      await axios.post(requestApi, { email });
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Password reset instructions have been sent to your email.
            </p>
            <button 
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => navigate('/')}
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="flex items-center border border-gray-300 rounded">
                <MdEmail className="text-gray-500 p-2" />
                <input
                  type="email"
                  className="flex-grow p-2 focus:outline-none"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <button
                type="submit"
                className={`bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                className="border border-gray-300 text-gray-700 py-2 px-4 rounded w-full hover:bg-gray-100"
                onClick={() => navigate('/')}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;