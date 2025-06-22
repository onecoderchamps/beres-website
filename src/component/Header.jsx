import React from 'react';
import { MdLogout, MdSupportAgent, MdAccountCircle } from 'react-icons/md'; // Importing relevant icons
import { useNavigate } from 'react-router-dom'; // For navigation
import logo from '../assets/logo.png'; // Ensure you have a logo image in your assets folder

const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessTokens');
    navigate('/LoginScreen', { replace: true });
    alert('Anda telah berhasil keluar.');
  };

  const handleCsClick = () => {
    alert('Menghubungi Customer Service...');
  };

  const handleProfileClick = () => {
    navigate('/AkunPage'); // Navigate to the profile page
  };

  return (
    <header className="flex items-center justify-between p-4 sticky top-0 z-50">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        {/* Replace with your actual logo image */}
        <img
          src={logo} // Using the imported logo
          alt="App Logo"
          className="h-8 w-auto mr-2" // Adjust height and width as needed
        />
        <span className="text-xl font-bold text-gray-800">Beres</span> {/* Replace "YourApp" with your app's name */}
      </div>

      {/* Right Section: Action Icons */}
      <div className="flex items-center space-x-4"> {/* Space out the icons */}
        {/* Logout Icon */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Logout"
        >
          <MdLogout size={24} className="text-red-500" /> {/* Red for logout action */}
        </button>

        {/* Customer Service Icon */}
        <button
          onClick={handleCsClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Customer Service"
        >
          <MdSupportAgent size={24} className="text-blue-500" /> {/* Blue for support */}
        </button>

        {/* Profile Icon */}
        <button
          onClick={handleProfileClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Profile"
        >
          <MdAccountCircle size={24} className="text-gray-700" /> {/* Neutral for profile */}
        </button>
      </div>
    </header>
  );
};

export default AppHeader;