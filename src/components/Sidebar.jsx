import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ActionPopup from './ActionPopup';

const Sidebar = ({tab}) => {
  const navigate = useNavigate();

  const [modal, setModal] = useState(false)
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setModal(false);

    try {
      const response = await axios.post('https://vica.website/api/logout', {}, {
        headers: {
          'Accept': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Logout Success:', response.data);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');

    } catch (error) {
      console.error('Logout Error:', error);
      
      if (error.response && error.response.status === 401) {
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         navigate('/login');
      }

      setErrors(error.response?.data?.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-2 left-2.5 z-50 p-2 rounded-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas fa-${isOpen ? 'times' : 'bars'}`}></i>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white fixed left-0 top-0 h-screen flex justify-start items-center flex-col py-5 z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static`}>
        <div className="mb-12 mt-12 md:mt-0">
          <h2 className="text-xl text-[#4880FF] font-extrabold">Dash<span className='text-black'>stack</span></h2>
        </div>
        <ul className="w-full h-[90%]">
          <li className={`mb-4 flex ${tab == 'dashboard' ? 'justify-between' : 'justify-center'} `}>
            {tab == 'dashboard' && <div className='w-4 bg-[#4880FF] rounded-r'></div>}

            <a href="#" className={`flex items-center ${tab == 'dashboard' ? 'bg-[#4880FF] hover:bg-[#4880FF]/90 text-white' : 'bg-white hover:text-[#4880FF]'}  py-2 px-5 w-[90%] rounded-md`}>
              <i className="fas fa-chart-pie mr-3"></i>
              <span>dashboard</span>
            </a>
          </li>
          <li className={`mb-4 flex ${tab == 'products' ? 'justify-between' : 'justify-center'} `}>
            {tab == 'products' && <div className='w-4 bg-[#4880FF] rounded-r'></div>}

            <a href="#" className={`flex items-center ${tab == 'products' ? 'bg-[#4880FF] hover:bg-[#4880FF]/90 text-white' : 'bg-white hover:text-[#4880FF]'}  py-2 px-5 w-[90%] rounded-md`}>
              <i className="fas fa-box mr-3"></i>
              <span>Products</span>
            </a>
          </li>
        </ul>
        <div className='w-full px-8'>
          {errors && (
            <div className="w-full mb-4 p-2.5 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {errors}
            </div>
          )}
           <button disabled={isLoading} className="w-full flex justify-center items-center disabled:cursor-not-allowed disabled:text-black hover:text-[#4880FF]" onClick={()=>setModal(true)}>
          {isLoading ? <>
          <i className="fa-solid fa-spinner animate-spin mr-3"></i>
          <span>Loging out...</span>
          </> :
          <>
            <i className="fa-solid fa-power-off mr-3"></i>
            <span>Logout</span>
          </>
          }
          </button>
        </div>
        {modal && <ActionPopup text={'Are you sure you want to logout?'} setModal={setModal} onConfirm={handleLogout}/>}
      </div>
    </>
  );
};

export default Sidebar;