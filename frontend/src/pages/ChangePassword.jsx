import React, { useEffect, useState } from 'react';
import {toast} from 'react-toastify'
import {changePassApi} from '../utils/routes'
import axios from 'axios';
import { useSelector } from 'react-redux';
const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

  const currentUser = useSelector(state=>state.selection.currentUser)
  useEffect(()=>{
    setEmail(currentUser.email)
  },[])
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          console.log('Old Password:', oldPassword);
          console.log('New Password:', newPassword);
          console.log('Confirm Password:', confirmPassword);
          await axios.post(changePassApi, {email, oldPassword, newPassword, confirmPassword},{withCredentials:true})
          toast.success('Password Changed Successfully')
          setNewPassword("")
          setConfirmPassword("")
          setOldPassword("")
        } catch (error) {
          toast.error(error.response?.data?.message || 'An error occurred')
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="oldPassword">Old Password</label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                        <a href="/forgot-password" className="text-sm text-blue-500 hover:underline mt-1 block">Forgot Password?</a>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white font-bold py-2 rounded hover:bg-gray-700"
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;