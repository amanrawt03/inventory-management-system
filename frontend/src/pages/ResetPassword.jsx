import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaKey } from 'react-icons/fa6';
import axios from 'axios';
import {resetApi} from '../utils/routes'
import {toast} from 'react-toastify'
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post(resetApi, {
        token,
        newPassword
      });
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
        <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Your password has been successfully reset.
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
              <label className="block text-gray-700 mb-2">New Password</label>
              <div className="flex items-center border border-gray-300 rounded">
                <FaKey className="text-gray-500 p-2" />
                <input
                  type="password"
                  className="flex-grow p-2 focus:outline-none"
                  placeholder="Enter new password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <div className="flex items-center border border-gray-300 rounded">
                <FaKey className="text-gray-500 p-2" />
                <input
                  type="password"
                  className="flex-grow p-2 focus:outline-none"
                  placeholder="Confirm new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className={`bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;