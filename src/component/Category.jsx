import React, { useEffect, useState } from 'react';
import {
  MdStore,
  MdAttachMoney,
  MdHome,
  MdVolunteerActivism,
  MdEmojiEvents
} from 'react-icons/md';
import { getData } from '../api/service';
import { useNavigate } from 'react-router-dom';
import { GiGoldBar } from 'react-icons/gi';

const categories = [
  { key: 'Patungan', label: 'Patungan', icon: MdStore },
  { key: 'Arisan', label: 'Arisan', icon: GiGoldBar },
  { key: 'Koperasi', label: 'Koperasi', icon: MdHome },
  { key: 'Sedekah', label: 'Sedekah', icon: MdVolunteerActivism },
];

const CategorySelector = () => {
  const [selected, setSelected] = useState(null);
  const [dataProfile, setDataProfile] = useState({});
  const navigate = useNavigate();

  const getDatabaseUser = async () => {
    try {
      const response = await getData('auth/verifySessions');
      setDataProfile(response.data);
    } catch (error) {
      alert(error?.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  useEffect(() => {
    getDatabaseUser();
  }, []);

  const handleCategorySelect = (key) => {
    setSelected(key);

    switch (key) {
      case 'Arisan':
        navigate('/Arisan');
        break;
      case 'Patungan':
        navigate('/Patungan');
        break;
      case 'Koperasi':
        navigate('/KoperasiScreen');
        break;
      case 'Sedekah':
        if (!dataProfile.isMember) {
          navigate('/RegisterScreen');
        } else {
          navigate(`/${key}`);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {categories.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => handleCategorySelect(key)}
          className={`w-18 h-18 flex flex-col items-center justify-center rounded-2xl shadow-md transition 
            ${selected === key
              ? 'bg-green-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          <Icon size={28} className="mb-1" />
          <span className="text-sm font-semibold ">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
