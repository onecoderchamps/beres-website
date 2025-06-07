import React, { useEffect, useState } from 'react';
import { LogOut, HelpCircle, LifeBuoy, Shield, Info, ChevronRight } from 'lucide-react';
import { getData } from '../../api/service';
import BackButton from '../../component/BackButton';

const AkunPage = () => {
  const [data, setData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDatabase = async () => {
    setLoading(true);
    try {
      const response = await getData('auth/verifySessions');
      setData(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Terjadi kesalahan saat memverifikasi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const signOut = async () => {
    localStorage.removeItem('accessTokens');
    alert('You have been logged out.');
  };

  const handleLogout = () => {
    if (window.confirm('Yakin ingin logout?')) {
      signOut();
    }
  };

  const menuItems = [
    { label: 'FAQ', icon: <HelpCircle className="w-5 h-5 text-green-900" /> },
    { label: 'Support', icon: <LifeBuoy className="w-5 h-5 text-green-900" /> },
    { label: 'Keamanan', icon: <Shield className="w-5 h-5 text-green-900" /> },
    { label: 'Tentang Aplikasi', icon: <Info className="w-5 h-5 text-green-900" /> },
  ];

  return (
    <div className="min-h-screen bg-white p-4">
        <BackButton title={"My Asset"} />
      {/* PROFILE */}
      <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-4 mb-6">
        <img
          src={data.image || 'https://via.placeholder.com/60'}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="text-base font-bold text-green-900">
            {data.fullName === '' || !data.fullName ? 'User Beres' : data.fullName}
          </div>
          <div className="text-sm text-gray-600">{data.phone || 'No phone'}</div>
        </div>
        {/* <button onClick={() => setModalVisible(true)}>
          <Pencil className="w-5 h-5 text-green-900" />
        </button> */}
      </div>

      {/* MENU ITEMS */}
      <div className="divide-y divide-gray-200">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-green-900 text-base">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="mt-10 flex items-center justify-center gap-2 w-full bg-green-900 text-white py-3 rounded-lg hover:bg-green-800 transition"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-base">Logout</span>
      </button>

      <p className="text-center text-xs text-gray-400 mt-6">Versi Aplikasi v1.0.0</p>

      {/* MODAL (optional, not implemented) */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <h2 className="font-semibold text-lg mb-4">Edit Profil</h2>
            <button onClick={() => setModalVisible(false)} className="text-blue-500">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AkunPage;
