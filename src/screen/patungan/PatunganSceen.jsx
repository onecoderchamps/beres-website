import React, { useEffect, useState } from 'react';
import { getData, postData } from '../../api/service'; // postData is not used, consider removing if not needed later
import PatunganComponent from './PatunganComponent'; // Assuming this component is already well-designed
import BackButton from '../../component/BackButton';
import { useNavigate } from 'react-router-dom';
import { FaHandHoldingUsd, FaSpinner } from 'react-icons/fa'; // Added icons for visual flair

const PatunganScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [patunganData, setPatunganData] = useState([]);
  const [userData, setUserData] = useState(null); // Renamed 'datas' to 'userData' for clarity

  useEffect(() => {
    getDatabase(); // Fetches user session data
    getDatabasePatungan(); // Fetches patungan initiatives
  }, []);

  const getDatabase = async () => {
    try {
      const response = await getData('auth/verifySessions');
      setUserData(response.data); // Store user session data
    } catch (error) {
      console.error("Error verifying session:", error); // Log the error for debugging
      alert(error.response?.data?.message || "Terjadi kesalahan saat memverifikasi sesi.");
    }
  };

  const getDatabasePatungan = async () => {
    setLoading(true); // Ensure loading state is active when fetching patungan data
    try {
      const res = await getData('Patungan');
      setPatunganData(res.data);
    } catch (error) {
      console.error("Error fetching Patungan data:", error); // Log the error for debugging
      alert(error?.response?.data?.message || "Terjadi kesalahan saat memuat data patungan.");
      setPatunganData([]); // Clear data on error
    } finally {
      setLoading(false); // Always stop loading, regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2"> {/* Soft background, padding-bottom */}
      <BackButton title={"Patungan"} />

      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]"> {/* Centered loading spinner */}
          <FaSpinner className="animate-spin text-purple-600 text-6xl" /> {/* Enhanced spinner */}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-4 pt-6">

          {/* Patungan Grid */}
          {patunganData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Responsive grid */}
              {patunganData.map((item) => (
                <div 
                  key={item.id} 
                  className="cursor-pointer transform hover:scale-[1.03] transition-transform duration-200 ease-in-out" 
                  onClick={() => navigate('/PatunganDetail/' + item.id, { state: { data: item } })}
                >
                  <PatunganComponent data={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Tidak ada patungan yang tersedia saat ini.</p>
              <p className="text-gray-500 mt-2">Silakan cek kembali nanti atau buat patungan baru.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatunganScreen;