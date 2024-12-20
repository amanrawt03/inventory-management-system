import defaultProfile from "../assets/defaultProfile.jpg";
import { fetchProfileApi, updateProfileApi } from "../utils/routes";
// Ensure this is the correct path
import axios from "axios";
import { Camera, Save, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { UploadProfileImgApi } from "../utils/routes";
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [profile, setProfile] = useState(null); // Initialize as null
  const [editedProfile, setEditedProfile] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          fetchProfileApi,
          { withCredentials: true }
        ); // Adjust the API endpoint as needed
        setProfile(response.data.data.user); // Assuming the API returns the profile data directly
        setEditedProfile(response.data.data.user); // Set edited profile to fetched data
      } catch (err) {
        setError("Failed to fetch profile data");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProfile();
  }, []);

 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    
    // Create a Promise to handle the asynchronous read
    const handleFileRead = new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });

    // Start reading the file
    reader.readAsDataURL(file);

    // Handle the result
    handleFileRead
      .then((result) => {
        setImagePreview(result);
        setEditedProfile((prev) => ({
          ...prev,
          profile_image: result,
        }));

        // Create FormData and append the file
        const formData = new FormData();
        formData.append('profileImage', file);  // 'profileImage' should match your backend field name

        // Send the FormData
        return axios.post(UploadProfileImgApi, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'   
          }
        });
      })
      .then((response) => {
        console.log('Image uploaded successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
        setImagePreview(null);
      });
  }
};
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert "Yes" to true and "No" to false
    if (value === "Yes" || value === "No") {
      setEditedProfile({ ...editedProfile, [name]: value === "Yes"?"true":"false" });
    } else {
      setEditedProfile({ ...editedProfile, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      // Send only the profile data
      const profileData = { ...editedProfile };
      delete profileData.profile_image; 
      
      const response = await axios.put(updateProfileApi, profileData, {
        withCredentials: true
      });
      
      setProfile(response.data.data.user);
      setIsEditing(false);
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
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
                src={imagePreview || profile.profile_image || defaultProfile}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600 cursor-pointer">
                  <Camera size={14} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
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
                value={isEditing ? editedProfile.location : profile.location}
                onChange={handleChange}
                disabled={!isEditing}
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
                name="phoneNumber"
                value={
                  isEditing ? editedProfile.phone_number : profile.phone_number
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
                Job Role
              </label>
              <input
                name="jobRole"
                value={isEditing ? editedProfile.job_role : profile.job_role}
                onChange={handleChange}
                disabled={!isEditing}
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
                name="bloodGroup"
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
                name="dateOfBirth"
                value={
                  isEditing
                    ? editedProfile.date_of_birth
                    : profile.date_of_birth
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
                name="maritalStatus"
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
                name="fatherName"
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Physically Challenged
              </label>
              <select
                name="physicallyChalleneged"
                value={
                  isEditing
                    ? editedProfile.physically_challeneged
                    : profile.physically_challeneged?"Yes":"No"
                }
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                International Employee
              </label>
              <select
                name="internationalEmployee"
                value={
                  isEditing
                    ? editedProfile.international_employee
                    : profile.international_employee?"Yes":"No"
                }
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? "border-gray-300" : "bg-gray-50"
                } rounded p-2 w-full`}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
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
                name="street"
                value={isEditing ? editedProfile.street_address : profile.street_address}
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
                name="zipCode"
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
      </div>
    </div>
  );
};

export default ProfilePage;
