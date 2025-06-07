import React, { useEffect, useState } from 'react';
import {
  MdStore,
  MdPhoneIphone,
  MdHome,
  MdVolunteerActivism,
  MdManageAccounts,
  MdMenuBook,
  MdPieChart,
  MdAccountBalance
} from 'react-icons/md';
import { getData } from '../api/service';
import { useNavigate } from 'react-router-dom';
import { GiGoldBar } from 'react-icons/gi';

const categories = [
  { key: 'Edukasi', label: 'Edukasi', icon: MdMenuBook },
  { key: 'Patungan', label: 'Patungan', icon: MdStore },
  { key: 'Arisan', label: 'Arisan', icon: GiGoldBar },
  { key: 'Sedekah', label: 'Sedekah', icon: MdVolunteerActivism },
  { key: 'Koperasi', label: 'Koperasi', icon: MdAccountBalance },
  { key: 'PPOB', label: 'PPOB', icon: MdPhoneIphone },
  { key: 'MyAsset', label: 'MyAsset', icon: MdPieChart },
  { key: 'MyProfile', label: 'MyProfile', icon: MdManageAccounts },
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
        navigate('/ArisanScreen');
        break;
      case 'Patungan':
        navigate('/PatunganScreen');
        break;
      case 'Koperasi':
        if (!dataProfile.isMember) {
          navigate('/RegisterScreen');
        } else {
          navigate(`/KoperasiScreen`);
        }
        break;
      case 'Sedekah':
        if (!dataProfile.isMember) {
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
      default:
        alert("Fitur Segera Hadir")
        break;
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {categories.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => handleCategorySelect(key)}
          className={`w-18 h-18 flex flex-col items-center justify-center rounded-2xl shadow-md transition bg-gray-200 text-gray-700 hover:bg-gray-300`}
        >
          <Icon size={28} className="mb-1" />
          <span className="text-sm font-semibold ">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
