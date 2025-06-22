import React, { useEffect, useState } from 'react';
import { LogOut, HelpCircle, LifeBuoy, Shield, Info, ChevronRight, UserCircle2 } from 'lucide-react'; // Added UserCircle2 for default avatar
import { getData } from '../../api/service';
import BackButton from '../../component/BackButton';
import { FaSpinner } from 'react-icons/fa'; // For loading spinner

const AkunPage = () => {
  const [userData, setUserData] = useState({}); // Renamed 'data' to 'userData' for clarity
  const [modalVisible, setModalVisible] = useState(false); // Modal for future profile editing
  const [loading, setLoading] = useState(true); // Set initial loading state to true

  // Fetches user session data
  const getDatabase = async () => {
    setLoading(true);
    try {
      const response = await getData('auth/verifySessions');
      setUserData(response.data);
    } catch (error) {
      console.error("Error verifying session:", error); // Log error for debugging
      // alert(error.response?.data?.message || 'Terjadi kesalahan saat memverifikasi sesi.'); // Optional: show alert
      setUserData({}); // Clear user data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  // Handles user sign out
  const signOut = () => {
    localStorage.removeItem('accessTokens');
    window.location.href = '/login'; // Redirect to login page
  };

  // Confirmation for logout
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari akun ini?')) {
      signOut();
    }
  };

  // Menu items configuration
  const menuItems = [
    { label: 'FAQ (Pertanyaan Umum)', icon: <HelpCircle />, path: '/faq' }, // Added path placeholder
    { label: 'Pusat Bantuan', icon: <LifeBuoy />, path: '/support' }, // Added path placeholder
    { label: 'Keamanan Akun', icon: <Shield />, path: '/security' }, // Added path placeholder
    { label: 'Tentang Aplikasi', icon: <Info />, path: '/about' }, // Added path placeholder
  ];

  return (
    <div className="min-h-screen bg-white p-2"> {/* Soft background, padding-bottom */}
      <BackButton title={"Akun Saya"} /> {/* Updated title for clarity */}

      <div className="max-w-4xl mx-auto p-4 pt-6"> {/* Max width, centered, and padded */}
        {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-64px)]"> {/* Centered loading spinner */}
            <FaSpinner className="animate-spin text-purple-600 text-6xl" /> {/* Enhanced spinner */}
          </div>
        ) : (
          <>
            {/* PROFILE SECTION */}
            <div className="flex items-center gap-4 bg-white rounded-2xl shadow-lg p-5 mb-8"> {/* Enhanced styling */}
              {userData.image ? (
                <img
                  src={userData.image}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-300" // Larger, border
                />
              ) : (
                <UserCircle2 className="w-20 h-20 text-gray-400" /> // Default icon if no image
              )}
              
              <div className="flex-1">
                <div className="text-xl font-bold text-gray-800"> {/* Larger font, darker color */}
                  {userData.fullName === '' || !userData.fullName ? 'Pengguna Beres' : userData.fullName}
                </div>
                <div className="text-md text-gray-600 mt-1">{userData.phone || 'Nomor telepon tidak tersedia'}</div>
                <div className="text-sm text-gray-500 mt-0.5">{userData.email || 'Email tidak tersedia'}</div> {/* Added email if available */}
              </div>
              {/* Uncomment this button if you plan to implement profile editing modal/page */}
              {/* <button onClick={() => setModalVisible(true)} className="p-2 rounded-full hover:bg-gray-100 transition">
                <Pencil className="w-6 h-6 text-purple-600" />
              </button> */}
            </div>

            {/* MENU ITEMS SECTION */}
            <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-100 mb-8"> {/* Unified card for menu, subtle divider */}
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  // onClick={() => navigate(item.path)} // Uncomment and implement navigation if paths are defined
                  className="flex justify-between items-center py-4 px-5 cursor-pointer 
                             hover:bg-gray-50 transition-all duration-200 ease-in-out"
                >
                  <div className="flex items-center gap-4"> {/* Increased gap */}
                    {React.cloneElement(item.icon, { className: 'w-6 h-6 text-purple-600' })} {/* Apply consistent styling to icons */}
                    <span className="text-gray-800 text-lg font-medium">{item.label}</span> {/* Larger font, darker color */}
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" /> {/* Larger arrow */}
                </div>
              ))}
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full bg-red-600 text-white 
                         py-4 rounded-xl shadow-md hover:bg-red-700 transition-colors duration-300 ease-in-out 
                         text-lg font-semibold" // Larger padding, red color for logout, more prominent
            >
              <LogOut className="w-6 h-6" />
              <span>Keluar Akun</span> {/* More formal/clearer text */}
            </button>

            {/* APP VERSION */}
            <p className="text-center text-sm text-gray-400 mt-8">Versi Aplikasi v1.0.0</p>

            {/* MODAL (Optional - For future profile editing) */}
            {modalVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-lg transform scale-95 animate-scale-in">
                  <h2 className="font-bold text-xl mb-4 text-gray-800">Edit Profil</h2>
                  <p className="text-gray-600 mb-6">Fitur ini akan segera tersedia!</p>
                  <button 
                    onClick={() => setModalVisible(false)} 
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AkunPage;