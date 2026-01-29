import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import axios from 'axios'; // Import axios
import Input from "../components/Input";
import shape from "../assets/Shape.png";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profileImage: null,
    profileImagePreview: null
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: file,
          profileImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.profileImage) {
      newErrors.profileImage = 'Profile image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const data = new FormData();

    data.append('first_name', formData.firstName);
    data.append('last_name', formData.lastName);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('password_confirmation', formData.password);

    const generatedUserName = `${formData.firstName}_${formData.lastName}`.toLowerCase();
    data.append('user_name', generatedUserName);

    if (formData.profileImage) {
      data.append('profile_image', formData.profileImage);
    }

    try {
      const response = await axios.post('https://vica.website/api/register', data, {
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Registration Success:', response.data);

      navigate('/'); 

    } catch (error) {
      console.error('Registration Error:', error);

      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(prev => ({
          ...prev,
          apiError: error.response.data.message || 'Registration failed'
        }));
      } else {
        setErrors(prev => ({ ...prev, apiError: 'Something went wrong. Please try again.' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#4880FF] text-[#202224] bg-cover bg-center flex items-center justify-center px-4 py-8 sm:px-0"
      style={{ backgroundImage: `url(${shape})` }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-lg h-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Sign Up</h2>
        <p className="text-center text-base sm:text-lg opacity-80 mb-5">
          Create an account to continue
        </p>

        {errors.apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {errors.apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input 
              label="First Name" 
              type="text" 
              placeholder="First Name" 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
            />
            <Input 
              label="Last Name" 
              type="text" 
              placeholder="Last Name" 
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
            />
          </div>
          <div className="mb-4">
            <Input 
              label="Email" 
              type="email" 
              placeholder="Email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
          </div>
          <div className="mb-4">
            <Input 
              label="Password" 
              type="password" 
              placeholder="Password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <div className="mt-1 flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {formData.profileImagePreview ? (
                <div className="text-center">
                  <img src={formData.profileImagePreview} alt="Preview" className="mx-auto h-16 sm:h-20 w-16 sm:w-20 object-cover rounded-md mb-4" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, profileImage: null, profileImagePreview: null }))}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center w-full">
                  <svg className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex flex-col sm:flex-row text-xs sm:text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                    <p className="sm:pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
            {errors.profileImage && <p className="text-red-500 text-xs mt-2">{errors.profileImage}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#4880FF] text-white py-3 rounded-md transition duration-300 font-semibold ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#4880FF]/90'}`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm font-semibold mt-4">
          Already have an account?{" "}
          <a href="/" className="text-[#5A8CFF] hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;