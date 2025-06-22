import React, { useState, useEffect } from 'react';
import BackButton from '../../component/BackButton';
import { useNavigate } from 'react-router-dom';
import { 
  FaMobileAlt, FaBolt, FaWifi, FaTv, FaCreditCard, 
  FaWater, FaGasPump, FaMedkit, FaGamepad, FaTicketAlt 
} from 'react-icons/fa'; // Import ikon yang relevan

const PPOBScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Bisa diatur true jika ada data yang diambil diawal
  const [saldo, setSaldo] = useState(500000); // Saldo dummy, ganti dengan data aktual

  // Daftar layanan PPOB umum
  const ppobServices = [
    { 
      id: 'pulsa', 
      name: 'Pulsa & Data', 
      icon: FaMobileAlt, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-50', 
      path: '/ppob/pulsa' 
    },
    { 
      id: 'pln', 
      name: 'Token & Tagihan PLN', 
      icon: FaBolt, 
      color: 'text-yellow-500', 
      bgColor: 'bg-yellow-50', 
      path: '/ppob/pln' 
    },
    { 
      id: 'pdam', 
      name: 'PDAM', 
      icon: FaWater, 
      color: 'text-cyan-500', 
      bgColor: 'bg-cyan-50', 
      path: '/ppob/pdam' 
    },
    { 
      id: 'internet', 
      name: 'Internet & TV Kabel', 
      icon: FaWifi, 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-50', 
      path: '/ppob/internet' 
    },
    { 
      id: 'bpjs', 
      name: 'BPJS Kesehatan', 
      icon: FaMedkit, 
      color: 'text-green-500', 
      bgColor: 'bg-green-50', 
      path: '/ppob/bpjs' 
    },
    { 
      id: 'multifinance', 
      name: 'Angsuran Kredit', 
      icon: FaCreditCard, 
      color: 'text-indigo-500', 
      bgColor: 'bg-indigo-50', 
      path: '/ppob/multifinance' 
    },
    { 
      id: 'pascabayar', 
      name: 'Telepon Pascabayar', 
      icon: FaMobileAlt, 
      color: 'text-teal-500', 
      bgColor: 'bg-teal-50', 
      path: '/ppob/pascabayar' 
    },
    { 
      id: 'gas', 
      name: 'Gas Negara (PGN)', 
      icon: FaGasPump, 
      color: 'text-orange-500', 
      bgColor: 'bg-orange-50', 
      path: '/ppob/gas' 
    },
    { 
      id: 'voucher_game', 
      name: 'Voucher Game', 
      icon: FaGamepad, 
      color: 'text-red-500', 
      bgColor: 'bg-red-50', 
      path: '/ppob/voucher-game' 
    },
    { 
      id: 'tiket', 
      name: 'Tiket (Kereta/Pesawat)', 
      icon: FaTicketAlt, 
      color: 'text-pink-500', 
      bgColor: 'bg-pink-50', 
      path: '/ppob/tiket' 
    },
  ];

  // Fungsi untuk format mata uang
  const formatCurrency = (number) => {
    if (typeof number !== 'number' || isNaN(number)) return '';
    return number.toLocaleString('id-ID');
  };

  const handleServiceClick = (path) => {
    alert('Segera Hadir!'); // Ganti dengan navigasi ke halaman layanan yang sesuai
    // navigate(path);
    // Di sini Anda bisa menambahkan logika atau animasi jika diperlukan
  };

  // Anda bisa menambahkan useEffect untuk mengambil saldo aktual jika ada API-nya
  /*
  useEffect(() => {
    const fetchSaldo = async () => {
      setLoading(true);
      try {
        const res = await getData('user/saldo'); // Contoh API endpoint
        setSaldo(res.data.currentSaldo);
      } catch (error) {
        console.error("Error fetching saldo:", error);
        // Handle error, mungkin tampilkan pesan ke pengguna
      } finally {
        setLoading(false);
      }
    };
    fetchSaldo();
  }, []);
  */

  return (
    <div className="bg-white min-h-screen p-2">
      <BackButton title={"PPOB"} />

      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <FaSpinner className="animate-spin text-purple-600 text-6xl" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-4 pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ppobServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-md p-4 text-center cursor-pointer 
                           transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
                onClick={() => handleServiceClick(service.path)}
              >
                <div className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                  <service.icon className={`text-3xl ${service.color}`} />
                </div>
                <p className="text-gray-800 font-semibold text-sm sm:text-base">{service.name}</p>
              </div>
            ))}
          </div>

          {/* Section untuk fitur lainnya (Opsional) */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg">Punya kebutuhan pembayaran lain?</p>
            <p className="text-gray-500 text-md mt-2">Hubungi dukungan kami untuk bantuan lebih lanjut.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PPOBScreen;