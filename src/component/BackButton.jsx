import React from 'react';
import { useNavigate } from 'react-router-dom'; // Gunakan useNavigate untuk navigasi
import { HiArrowLeft } from 'react-icons/hi'; // Icon dari Heroicons (React Icons)

const BackButton = ({ onClick, title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1); // Kembali ke halaman sebelumnya
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center bg-transparent border-none text-gray-800 text-lg font-semibold cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
    >
      <HiArrowLeft className="text-xl mr-3" /> {/* Ukuran ikon lebih besar */}
      <span>{title}</span>
    </button>
  );
};

export default BackButton;