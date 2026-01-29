import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import axios from 'axios'; // Import axios
import Input from "../components/Input";
import shape from "../assets/Shape.png";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);

    try {
      const response = await axios.post('https://vica.website/api/task-login', data, {
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Login Success:', response.data);

      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        navigate('/products'); 
      }

    } catch (error) {
      console.error('Login Error:', error);

      if (error.response && error.response.status === 401) {
        setErrors(prev => ({ ...prev, apiError: 'Invalid email or password.' }));
      } else if (error.response && error.response.data && error.response.data.message) {
        setErrors(prev => ({ ...prev, apiError: error.response.data.message }));
      } else {
        setErrors(prev => ({ ...prev, apiError: 'Something went wrong. Please try again.' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#4880FF] text-[#202224] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${shape})` }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-2xl w-96 md:w-full max-w-lg h-162.5">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Sign In</h2>
        <p className="text-center text-base sm:text-lg opacity-80 mb-5">
          Please enter your email and password to continue
        </p>

        {errors.apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {errors.apiError}
          </div>
        )}

        <form className='min-h-110 flex justify-between flex-col' onSubmit={handleSubmit}>
          <div>
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#4880FF] text-white py-3 rounded-md transition duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#4880FF]/90'}`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm font-semibold mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-[#5A8CFF] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login;