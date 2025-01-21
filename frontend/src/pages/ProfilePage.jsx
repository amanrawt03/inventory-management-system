import { setProfileImage } from "../slice/selectionSlice";
import { fetchProfileApi, updateProfileApi } from "../utils/routes";
// Ensure this is the correct path
import axios from "axios";
import { Camera, Save, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Typography } from "@mui/material";
const ProfilePage = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [profile, setProfile] = useState({
    employee_id: "",
    email: "",
    location: "",
    phone_number: "",
    job_role: "",
    blood_group: "",
    date_of_birth: "",
    nationality: "",
    marital_status: "",
    father_name: "",
    religion: "",
    profile_image: "",
  });
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(false); // Error state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(fetchProfileApi, {
          withCredentials: true,
        });
        setProfile(response.data.data.user); // Assuming the API returns the profile data directly
        setEditedProfile(response.data.data.user); // Set edited profile to fetched data
      } catch (err) {
        setError("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "Yes" || value === "No") {
      setEditedProfile({ ...editedProfile, [name]: value === "Yes" });
    } else {
      setEditedProfile({ ...editedProfile, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Append all profile fields
      Object.keys(editedProfile).forEach((key) => {
        formData.append(key, editedProfile[key]);
      });

      // If a new image is uploaded, append it
      if (imagePreview) {
        const fileInput = document.querySelector("input[type='file']");
        if (fileInput && fileInput.files.length > 0) {
          formData.append("profileImage", fileInput.files[0]); // Backend field name
        }
      }

      const response = await axios.put(updateProfileApi, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(response.data.data.user); // Update the profile with saved data
      dispatch(setProfileImage(response.data.data.user.profile_image));
      setIsEditing(false);
      setImagePreview(null);
    } catch (err) {
      setError("Failed to save profile data");
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setImagePreview(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const today = new Date();

    // Set the time of today to midnight to compare only the date part
    today.setHours(0, 0, 0, 0);

    // Validate that the date is not in the future
    if (date > today) {
      toast.error("Future dates not allowed");
      return "Error: Future dates are not allowed.";
    }

    // Get the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    // Format as yyyy-MM-dd
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Employee Profile
        </Typography>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-900 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold">Profile Information</h2>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <img
                src={imagePreview || profile.profile_image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600 cursor-pointer">
                  <Camera size={14} />
                  <input
                    name="profileImage"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>
                  <input
                    name="employeeId"
                    value={profile.employee_id}
                    disabled
                    className="bg-gray-50 border border-gray-300 rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Email
                  </label>
                  <input
                    name="companyEmail"
                    value={profile.email}
                    disabled
                    className="bg-gray-50 border border-gray-300 rounded p-2 w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                name="location"
                value={profile.location}
                onChange={handleChange}
                disabled
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                name="phone_number"
                value={
                  isEditing ? editedProfile.phone_number : profile.phone_number
                }
                onChange={handleChange}
                disabled={!isEditing}
                maxLength={10} // Use maxLength instead of max
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Role
              </label>
              <input
                name="job_role"
                value={profile.job_role}
                onChange={handleChange}
                disabled
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <select
                name="blood_group"
                value={
                  isEditing ? editedProfile.blood_group : profile.blood_group
                }
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              >
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                  (group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={
                  isEditing
                    ? formatDate(editedProfile.date_of_birth)
                    : formatDate(profile.date_of_birth)
                }
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nationality
              </label>
              <input
                name="nationality"
                value={
                  isEditing ? editedProfile.nationality : profile.nationality
                }
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marital Status
              </label>
              <select
                name="marital_status"
                value={
                  isEditing
                    ? editedProfile.marital_status
                    : profile.marital_status
                }
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              >
                {["Single", "Married", "Divorced", "Widowed"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Father's Name
              </label>
              <input
                name="father_name"
                value={
                  isEditing ? editedProfile.father_name : profile.father_name
                }
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Religion
              </label>
              <input
                name="religion"
                value={isEditing ? editedProfile.religion : profile.religion}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                name="street_address"
                value={
                  isEditing
                    ? editedProfile.street_address
                    : profile.street_address
                }
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                name="city"
                value={isEditing ? editedProfile.city : profile.city}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                name="state"
                value={isEditing ? editedProfile.state : profile.state}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                name="zip_code"
                value={isEditing ? editedProfile.zip_code : profile.zip_code}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                name="country"
                value={isEditing ? editedProfile.country : profile.country}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              />
            </div>
          </div>
        </div>
        <Link to={"/changePassword"} className="text-blue-900">
          Change Password
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
