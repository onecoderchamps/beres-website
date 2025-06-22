import React, { useEffect, useState } from 'react';
import {
  MdStore,
  MdPhoneIphone,
  MdHome, // Not used in categories, but keeping for completeness
  MdVolunteerActivism,
  MdManageAccounts,
  MdMenuBook,
  MdPieChart,
  MdAccountBalance,
  MdOutlineRocketLaunch // New icon suggestion for "Segera Hadir" or generic
} from 'react-icons/md';
import { getData } from '../api/service';
import { useNavigate } from 'react-router-dom';
import { GiGoldBar } from 'react-icons/gi';
import { FaGraduationCap, FaDonate, FaHandshake, FaChartPie, FaUserCircle, FaMobileAlt } from 'react-icons/fa'; // More modern icon alternatives

// Define categories with enhanced structure and icon choices
const categories = [
  { key: 'Edukasi', label: 'Edukasi', icon: FaGraduationCap, color: 'text-blue-600' }, // More vibrant colors
  { key: 'Patungan', label: 'Patungan', icon: MdStore, color: 'text-green-600' },
  { key: 'Arisan', label: 'Arisan', icon: GiGoldBar, color: 'text-yellow-600' },
  { key: 'Sedekah', label: 'Sedekah', icon: FaDonate, color: 'text-purple-600' },
  { key: 'Koperasi', label: 'Koperasi', icon: FaHandshake, color: 'text-red-600' },
  { key: 'PPOB', label: 'PPOB', icon: FaMobileAlt, color: 'text-orange-600' },
  { key: 'MyAsset', label: 'MyAsset', icon: FaChartPie, color: 'text-teal-600' },
  { key: 'MyProfile', label: 'Profile', icon: FaUserCircle, color: 'text-indigo-600' }, // Changed label to 'Profile'
];

const CategorySelector = () => {
  const [selected, setSelected] = useState(null); // This state isn't strictly necessary for visual feedback if navigating immediately
  const [dataProfile, setDataProfile] = useState(null); // Initialize as null to handle loading state
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  const getDatabaseUser = async () => {
    setLoadingProfile(true);
    try {
      const response = await getData('auth/verifySessions');
      setDataProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile for category check:", error);
      // Optionally handle specific errors, e.g., redirect if token is invalid
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    getDatabaseUser();
  }, []);

  const handleCategorySelect = (key) => {
    setSelected(key); // Still set for potential future use or debugging

    // Handle cases where dataProfile might still be loading or null
    if (loadingProfile) {
      // You might want to show a loading indicator or disable buttons
      alert("Mohon tunggu, data pengguna sedang dimuat...");
      return;
    }

    switch (key) {
      case 'Arisan':
        navigate('/ArisanScreen');
        break;
      case 'Patungan':
        navigate('/PatunganScreen');
        break;
      case 'Koperasi':
        if (!dataProfile?.isMember) { // Use optional chaining for safety
          navigate('/RegisterScreen');
        } else {
          navigate(`/KoperasiScreen`);
        }
        break;
      case 'Sedekah':
        if (!dataProfile?.isMember) { // Use optional chaining for safety
          navigate('/RegisterScreen');
        } else {
          navigate(`/SedekahScreen`);
        }
        break;
      case 'MyAsset':
        navigate('/AktifitasPage');
        break;
      case 'MyProfile':
        navigate('/AkunPage');
        break;
      case 'Edukasi':
        navigate('/EdukasiScreen');
        break;
      case 'PPOB': // Example for a "coming soon" feature with a specific key
        alert("Fitur PPOB Segera Hadir!");
        break;
      default: // Fallback for any other undefined categories
        alert("Fitur Segera Hadir!");
        break;
    }
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4"> {/* Responsive grid */}
      {categories.map(({ key, label, icon: Icon, color }) => (
        <button
          key={key}
          onClick={() => handleCategorySelect(key)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl shadow-sm transition-all duration-200 ease-in-out
                      bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75
                      transform active:scale-95`}
          disabled={loadingProfile} // Disable buttons while profile data is loading
        >
          <Icon size={28} className={`mb-1 ${color || 'text-gray-700'}`} /> {/* Apply dynamic color */}
          <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{label}</span> {/* Smaller font, centered */}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;