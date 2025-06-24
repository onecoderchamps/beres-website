// src/HomeScreen.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../../component/ImageSlider'; // Assume this is already mobile-friendly
import MembershipCard from '../../component/Membership'; // Assume this is already mobile-friendly
import CategorySelector from '../../component/Category'; // Assume this is already mobile-friendly
import { getData } from '../../api/service';
import PatunganCard from '../../component/PatunganView'; // Will ensure this is mobile-friendly
import ArisanComponent from '../../component/ArisanView'; // Will ensure this is mobile-friendly
import AppHeader from '../../component/Header';
import EventList from '../../component/EventList'; // <-- Import EventList

function HomeScreen() {
  const navigate = useNavigate();
  const [patunganData, setPatunganData] = useState([]);
  const [arisanData, setArisanData] = useState([]);
  const [loadingPatungan, setLoadingPatungan] = useState(true);
  const [loadingArisan, setLoadingArisan] = useState(true);
  const [errorPatungan, setErrorPatungan] = useState(null);
  const [errorArisan, setErrorArisan] = useState(null);

  // Use useCallback for memoizing fetch functions
  const getDatabasePatungan = useCallback(async () => {
    setLoadingPatungan(true);
    setErrorPatungan(null);
    try {
      const res = await getData('Patungan');
      if (res && res.data) { // Ensure res and res.data exist
        setPatunganData(Array.isArray(res.data) ? res.data : [res.data]); // Handle single object or array
      } else {
        setPatunganData([]);
        setErrorPatungan("Data Patungan tidak ditemukan.");
      }
    } catch (error) {
      console.error("Gagal fetch Patungan:", error);
      setErrorPatungan("Gagal memuat data Patungan.");
    } finally {
      setLoadingPatungan(false);
    }
  }, []);

  const getDatabaseArisan = useCallback(async () => {
    setLoadingArisan(true);
    setErrorArisan(null);
    try {
      const res = await getData('Arisan');
      if (res && res.data) { // Ensure res and res.data exist
        setArisanData(Array.isArray(res.data) ? res.data : [res.data]); // Handle single object or array
      } else {
        setArisanData([]);
        setErrorArisan("Data Arisan tidak ditemukan.");
      }
    } catch (error) {
      console.error("Gagal fetch Arisan:", error);
      setErrorArisan("Gagal memuat data Arisan.");
    } finally {
      setLoadingArisan(false);
    }
  }, []);

  const checkAuth = useCallback(() => {
    const accessToken = localStorage.getItem('accessTokens');
    if (!accessToken) {
      navigate('/LoginScreen', { replace: true });
    }
  }, [navigate]);

  const [events, setEvents] = useState([]);


  const fetchEvents = useCallback(async () => {
    try {
      const res = await getData('event'); // Endpoint event
      // Filter events that are not in the past
      const futureEvents = res.data.filter(event => new Date(event.dueDate) >= new Date());
      // Sort by dueDate to show upcoming events first
      futureEvents.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setEvents(futureEvents);
    } catch (err) {
      alert('Gagal memuat data event. Silakan coba lagi nanti.');
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    checkAuth();
    getDatabasePatungan();
    getDatabaseArisan();
  }, [checkAuth, getDatabasePatungan, getDatabaseArisan,fetchEvents]); // Added all useCallback dependencies

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
          // Only render if sisaSlot > 0 for Patungan and Arisan
          // Added a check for 'sisaSlot' only if it's a Patungan or Arisan type
          // Assuming Patungan and Arisan always have sisaSlot. If not, adjust logic
          (item.sisaSlot === undefined || item.sisaSlot > 0) ? (
            <div
              key={item.id || idx} // Use item.id if available, fallback to idx
              className="flex-none w-64 md:w-72 cursor-pointer transform transition-transform duration-200 hover:scale-[1.02] active:scale-98"
              onClick={() => navigate(`${navigatePath}/${item.id}`)}
            >
              <Component data={item} />
            </div>
          ) : null // Don't render if sisaSlot is 0
        ))}
        {/* Add a "Lihat Semua" button if there are many items */}
        {data.length > 3 && ( // Example: show button if more than 3 items
          <div className="flex-none w-24 flex items-center justify-center p-2">
            <button
              onClick={() => navigate(navigatePath === '/PatunganDetail' ? '/AllPatungan' : '/AllArisan')} // Example path
              className="flex items-center justify-2 flex-col h-full w-full bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
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
      <div className="p-4 bg-gradient-to-b from-yellow-50 to-white">
        <ImageSlider />
        <MembershipCard />
      </div>

      {/* Category Selector Section */}
      <div className="mt-3">
        <h2 className="ml-4 text-xl font-bold text-gray-800 mb-2">Telusuri Kategori</h2>
        <CategorySelector />
      </div>

      {/* New: Upcoming Events Section */}
      {events.length > 0 &&
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 px-4 mb-4">Event Mendatang</h2>
          <EventList events={events} /> {/* <-- Use the new EventList component here */}
        </div>
      }

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