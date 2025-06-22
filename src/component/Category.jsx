import React, { useEffect, useState } from 'react';
import {
  MdStore,
} from 'react-icons/md';
import { getData } from '../api/service';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaDonate, FaHandshake, FaChartPie, FaUserCircle, FaMobileAlt } from 'react-icons/fa';
import { AiFillGold } from "react-icons/ai";
import { BiDonateHeart } from "react-icons/bi";

// Define categories with enhanced structure and icon choices
const categories = [
  { key: 'Edukasi', label: 'Edukasi', icon: FaGraduationCap, color: 'text-blue-600' },
  { key: 'Patungan', label: 'Patungan', icon: MdStore, color: 'text-green-600' },
  { key: 'Arisan', label: 'Arisan', icon: AiFillGold, color: 'text-yellow-600' },
  { key: 'Sedekah', label: 'Sedekah', icon: BiDonateHeart, color: 'text-purple-600' },
  { key: 'Koperasi', label: 'Koperasi', icon: FaHandshake, color: 'text-red-600' },
  { key: 'PPOB', label: 'PPOB', icon: FaMobileAlt, color: 'text-orange-600' },
  { key: 'MyAsset', label: 'AssetKu', icon: FaChartPie, color: 'text-teal-600' },
  { key: 'MyProfile', label: 'Profile', icon: FaUserCircle, color: 'text-indigo-600' },
];

const CategorySelector = () => {
  const [selected, setSelected] = useState(null);
  const [dataProfile, setDataProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const navigate = useNavigate();

  const getDatabaseUser = async () => {
    setLoadingProfile(true);
    try {
      const response = await getData('auth/verifySessions');
      setDataProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile for category check:", error);
      // Handle error, e.g., if session expired, redirect to login
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    getDatabaseUser();
  }, []);

  const handleCategorySelect = (key) => {
    setSelected(key);

    if (loadingProfile) {
      alert("Mohon tunggu, data pengguna sedang dimuat...");
      return;
    }

    // Define categories that require membership check
    const memberRequiredCategories = ['Patungan', 'Arisan', 'Koperasi', 'Sedekah'];

    if (memberRequiredCategories.includes(key) && !dataProfile?.isMember) {
      // If the category requires membership and user is not a member, show modal
      setShowMembershipModal(true);
      return; // Stop further navigation until modal is handled
    }

    // Navigate for all other cases (either not a member-required category, or user is a member)
    switch (key) {
      case 'Arisan':
        navigate('/ArisanScreen');
        break;
      case 'Patungan':
        navigate('/PatunganScreen');
        break;
      case 'Koperasi':
        navigate(`/KoperasiScreen`);
        break;
      case 'Sedekah':
        navigate(`/SedekahScreen`);
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
      case 'PPOB':
        alert("Fitur PPOB Segera Hadir!");
        break;
      default:
        alert("Fitur Segera Hadir!");
        break;
    }
  };

  const handleRegisterNow = () => {
    setShowMembershipModal(false); // Close modal
    navigate('/RegisterScreen'); // Redirect to registration
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
      {categories.map(({ key, label, icon: Icon, color }) => (
        <button
          key={key}
          onClick={() => handleCategorySelect(key)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl shadow-sm transition-all duration-200 ease-in-out
                      bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75
                      transform active:scale-95`}
          disabled={loadingProfile}
        >
          <Icon size={28} className={`mb-1 ${color || 'text-gray-700'}`} />
          <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{label}</span>
        </button>
      ))}

      {/* Membership Modal */}
      {showMembershipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Akses Terbatas!</h3>
            <p className="text-gray-700 mb-6">
              Kamu belum menjadi member koperasi. Untuk mengakses fitur ini,
              silakan daftar terlebih dahulu.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRegisterNow}
                className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Daftar Sekarang
              </button>
              <button
                onClick={() => setShowMembershipModal(false)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;