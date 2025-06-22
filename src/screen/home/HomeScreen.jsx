import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../../component/ImageSlider'; // Assume this is already mobile-friendly
import MembershipCard from '../../component/Membership'; // Assume this is already mobile-friendly
import CategorySelector from '../../component/Category'; // Assume this is already mobile-friendly
import { getData } from '../../api/service';
import PatunganCard from '../../component/PatunganView'; // Will ensure this is mobile-friendly
import ArisanComponent from '../../component/ArisanView'; // Will ensure this is mobile-friendly
import AppHeader from '../../component/Header';

function HomeScreen() {
  const navigate = useNavigate();
  const [patunganData, setPatunganData] = useState([]);
  const [arisanData, setArisanData] = useState([]);
  const [loadingPatungan, setLoadingPatungan] = useState(true);
  const [loadingArisan, setLoadingArisan] = useState(true);
  const [errorPatungan, setErrorPatungan] = useState(null);
  const [errorArisan, setErrorArisan] = useState(null);

  useEffect(() => {
    const getDatabasePatungan = async () => {
      setLoadingPatungan(true);
      setErrorPatungan(null);
      try {
        const res = await getData('Patungan'); // Renamed res2 to res for clarity
        setPatunganData(res.data);
      } catch (error) {
        console.error("Gagal fetch Patungan:", error);
        setErrorPatungan("Gagal memuat data Patungan.");
      } finally {
        setLoadingPatungan(false);
      }
    };

    const getDatabaseArisan = async () => {
      setLoadingArisan(true);
      setErrorArisan(null);
      try {
        const res = await getData('Arisan'); // Renamed res2 to res for clarity
        setArisanData(res.data);
      } catch (error) {
        console.error("Gagal fetch Arisan:", error); // Corrected console error message
        setErrorArisan("Gagal memuat data Arisan.");
      } finally {
        setLoadingArisan(false);
      }
    };

    const checkAuth = async () => {
      // It's better to get the token directly from localStorage
      // and check its validity or presence
      const accessToken = localStorage.getItem('accessTokens');
      if (!accessToken) {
        // Use replace: true to prevent going back to login screen with back button
        navigate('/LoginScreen', { replace: true });
      }
    };

    checkAuth();
    getDatabasePatungan();
    getDatabaseArisan();
  }, [navigate]); // Added navigate to dependency array

  // Helper function to render content or messages
  const renderContent = (data, loading, error, Component, navigatePath) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-24">
          <p className="text-gray-500">Memuat data...</p> {/* Simple loading indicator */}
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex justify-center items-center h-24">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      );
    }
    if (data.length === 0) {
      return (
        <div className="flex justify-center items-center h-24">
          <p className="text-gray-500">Belum ada data tersedia.</p>
        </div>
      );
    }
    return (
      <div className="flex overflow-x-auto space-x-4 px-4 pb-4 scrollbar-hide">
        {data.map((item, idx) => (
          // Only render if sisaSlot > 0
          item.sisaSlot > 0 && (
            <div
              key={item.id || idx} // Use item.id if available, fallback to idx
              className="flex-none w-64 md:w-72 cursor-pointer transform transition-transform duration-200 hover:scale-[1.02] active:scale-98"
              onClick={() => navigate(`${navigatePath}/${item.id}`)}
            >
              <Component data={item} />
            </div>
          )
        ))}
        {/* Add a "Lihat Semua" button if there are many items */}
        {data.length > 3 && ( // Example: show button if more than 3 items
          <div className="flex-none w-24 flex items-center justify-center p-2">
            <button
              onClick={() => navigate(navigatePath === '/PatunganDetail' ? '/AllPatungan' : '/AllArisan')} // Example path
              className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
            >
              Lihat Semua
            </button>
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="bg-white min-h-screen pb-16 font-sans antialiased">
      {/* Top Section */}
      {/* <AppHeader /> */}
      <div className="p-4 bg-gradient-to-b from-yellow-50 to-white">
        <ImageSlider />
        <MembershipCard />
      </div>

      {/* Category Selector Section */}
      <div className="mt-3">
        <h2 className="ml-4 text-xl font-bold text-gray-800 mb-2">Telusuri Kategori</h2>
        <CategorySelector />
      </div>

      {/* Promo Patungan Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 px-4 mb-4">Promo Patungan</h2>
        {renderContent(patunganData, loadingPatungan, errorPatungan, PatunganCard, '/PatunganDetail')}
      </div>

      {/* Promo Arisan Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 px-4 mb-4">Promo Arisan</h2>
        {renderContent(arisanData, loadingArisan, errorArisan, ArisanComponent, '/ArisanDetail')}
      </div>

      {/* Footer Branding */}
      <div className="mt-12 text-center text-xs text-gray-400">
        <p>© 2025 PT PATUNGAN PROPERTI INTERNASIONAL</p>
      </div>
    </div>
  );
}

export default HomeScreen;