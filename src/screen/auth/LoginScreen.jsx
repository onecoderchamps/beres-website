import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../api/service';
import logo from '../../assets/logo.png'; // Pastikan path ini sesuai

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // State untuk pesan kesalahan
  const navigate = useNavigate();

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    // Logika untuk memastikan format +62
    if (cleaned.startsWith('08')) return '+62' + cleaned.slice(1);
    if (cleaned.startsWith('62')) return '+62' + cleaned.slice(2);
    if (cleaned.startsWith('8')) return '+62' + cleaned;
    if (cleaned.startsWith('628')) return '+' + cleaned;
    if (cleaned.startsWith('+628')) return cleaned;
    return '+62' + cleaned; // Default jika format tidak cocok
  };

  const sendOtp = async () => {
    setError(''); // Hapus kesalahan sebelumnya setiap kali mencoba
    if (!phoneNumber.trim()) {
      setError("Nomor ponsel tidak boleh kosong.");
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Validasi tambahan untuk nomor ponsel yang sudah diformat
    if (formattedPhone.length < 10 || !formattedPhone.startsWith('+62')) { // Contoh validasi minimal 10 digit setelah +62
        setError("Format nomor ponsel tidak valid. Gunakan format 08xx atau +628xx.");
        return;
    }

    const formData = {
      phonenumber: formattedPhone
    };

    setLoading(true);
    try {
      // Simulasi panggilan API (hapus ini di produksi)
      // await new Promise(resolve => setTimeout(resolve, 1500));
      await postData('otp/sendWA', formData); // Gunakan ini di produksi
      localStorage.setItem('phonenumber', formattedPhone);
      navigate('/OtpScreen');
    } catch (err) {
      console.error("API Error:", err);
      setError("Gagal mengirim OTP. Mohon coba lagi atau hubungi dukungan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-white p-4 font-sans antialiased">
      {/* Kontainer Utama untuk Konten */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 md:p-8 transform transition-all duration-300 ease-in-out border border-gray-100">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Aplikasi" className="w-28 h-28 object-contain" />
        </div>

        {/* Judul Utama */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center mb-2 leading-tight">
          Masuk ke Akun Anda
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
          Verifikasi nomor ponsel Anda untuk melanjutkan.
        </p>

        {/* Form Input */}
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Ponsel
          </label>
          <input
            type="tel"
            id="phoneNumber"
            placeholder="Cth. 081234567890"
            className={`w-full px-4 py-3 border ${
              error ? 'border-red-500 focus:ring-red-red-500' : 'border-gray-300 focus:ring-yellow-500'
            } rounded-xl text-base text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:border-transparent transition duration-200 ease-in-out appearance-none`}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 animate-fade-in">
              {error}
            </p>
          )}
        </div>

        {/* Tombol Aksi */}
        <button
          onClick={sendOtp}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-gray-900 shadow-md transition duration-300 ease-in-out transform
            ${loading
              ? 'bg-yellow-300 cursor-not-allowed opacity-75'
              : 'bg-yellow-400 hover:bg-yellow-500 active:scale-98 hover:shadow-lg'
            }
            flex items-center justify-center
          `}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengirim...
            </div>
          ) : (
            'Masuk'
          )}
        </button>

        {/* Teks Kebijakan/Syarat & Ketentuan */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Dengan masuk, Anda menyetujui <a href="#" className="text-yellow-600 hover:text-yellow-700 underline font-medium">Syarat & Ketentuan</a> kami.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;