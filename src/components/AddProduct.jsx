import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from './Input';

const AddProduct = ({ setView, product = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: null, // Stores the raw File object
    imagePreview: null // Stores the URL for display
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        image: null, // Reset file input on edit load
        imagePreview: product.image || null // Use existing URL as preview
      });
    }
  }, [product, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file, // Important: Store the file object for the API
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    
    // Only require image if adding new, or if existing image preview is missing
    if (!formData.imagePreview) newErrors.image = 'Product image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // 1. Prepare FormData
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);

    // Only append image if the user selected a NEW file
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      let url = 'https://vica.website/api/items';
      
      if (isEditing && product) {
        // UPDATE LOGIC
        url = `https://vica.website/api/items/${product.id}`;
        // CRITICAL: Laravel/PHP often requires _method="PUT" in a POST request 
        // to handle multipart/form-data (file uploads) correctly.
        data.append('_method', 'PUT'); 
      }

      // 2. Send Request (Always POST because of FormData limitations with PUT)
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          // Axios automatically sets Content-Type to multipart/form-data with boundary
        }
      });

      console.log('Success:', response.data);
      setView('view'); // Return to list view (triggers refetch in parent)

    } catch (error) {
      console.error('Operation failed:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        // If API returns field specific errors (e.g. "The name field is required")
        // You can map them here, or just show a generic error
        setErrors(prev => ({...prev, apiError: "Failed to save product. Please check inputs."}));
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', price: '', image: null, imagePreview: null });
    setErrors({});
    setView('view');
  };

  return (
    <div className='p-3 sm:p-5'>
      <div className="mb-5">
        <h1 className="text-xl sm:text-[28px] font-bold">{isEditing ? 'Edit' : 'Add'} Product</h1>
      </div>
      <form className='grid grid-cols-1 lg:grid-cols-2 items-start gap-6 lg:gap-16' onSubmit={handleSubmit}>
        <div className='space-y-4 sm:space-y-7'>
          <Input 
            label="Product Name" 
            type="text" 
            placeholder="Product Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          <Input 
            label="Price" 
            type="number" 
            placeholder="Price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            error={errors.price}
          />
        </div>

        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <div className="mt-1 flex justify-center px-3 sm:px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            {formData.imagePreview ? (
              <div className="text-center">
                <img src={formData.imagePreview} alt="Preview" className="mx-auto h-16 sm:h-20 w-16 sm:w-20 object-cover rounded-md mb-4" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: null }))}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center w-full">
                <svg
                  className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex flex-col sm:flex-row text-xs sm:text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
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
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
          {errors.image && <p className="text-red-500 text-xs mt-2">{errors.image}</p>}
        </div>

        <div className='flex flex-col sm:flex-row justify-start items-center gap-3 sm:gap-5 col-span-1 lg:col-span-2'>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto bg-[#4880FF] hover:bg-[#4880FF]/90 text-white py-2 px-10 rounded-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button 
            type="button"
            className='w-full sm:w-auto border border-[#4880FF] hover:border-[#4880FF]/75 hover:text-[#4880FF]/75 text-[#4880FF] py-2 px-8 rounded-sm' 
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;