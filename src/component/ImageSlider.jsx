  import React, { useEffect, useState } from 'react';
  import { HiOutlineBell } from 'react-icons/hi'; // Contoh ikon notifikasi
  import { getData } from '../api/service';

  const WelcomeHeader = ({ userName }) => {
    // Anda bisa menambahkan logika untuk icon notifikasi di sini,
    // misalnya jumlah notifikasi yang belum dibaca
    const hasNotifications = false; // Contoh: ganti dengan logika Anda
      const [data, setData] = useState({});
      const getDatabase = async () => {
        try {
          const response = await getData('auth/verifySessions');
          setData(response.data);
        } catch (error) {
          alert(error || 'Terjadi kesalahan saat memverifikasi.');
        }
      };
    
      useEffect(() => {
        getDatabase();
      }, []);

    return (
      <div className="flex items-center justify-between py-4 px-2"> {/* Padding horizontal diatur di Home Screen */}
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">Selamat Datang</p>
          <h1 className="text-2xl font-bold text-gray-900 truncate">
            Hai, {data.fullName}
          </h1>
        </div>
        <div className="relative">
          {/* <HiOutlineBell className="w-7 h-7 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors duration-200" /> */}
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
      </div>
    );
  };

  export default WelcomeHeader;