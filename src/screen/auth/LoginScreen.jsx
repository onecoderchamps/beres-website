import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../api/service';
import logo from '../../assets/logo.png'; // Pastikan path ini sesuai

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('08')) return '+62' + cleaned.slice(1);
    if (cleaned.startsWith('62')) return '+62' + cleaned.slice(2);
    if (cleaned.startsWith('8')) return '+62' + cleaned;
    if (cleaned.startsWith('628')) return '+' + cleaned;
    if (cleaned.startsWith('+628')) return cleaned;
    return '+62' + cleaned;
  };

  const sendOtp = async () => {
    if (!phoneNumber.trim()) {
      alert("Nomor ponsel tidak boleh kosong.");
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    const formData = {
      phonenumber: formattedPhone
    };

    setLoading(true);
    try {
      await postData('otp/sendWA', formData);
      localStorage.setItem('phonenumber', formattedPhone);
      navigate('/OtpScreen');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white">
      <div className="flex-1 flex items-center justify-center">
        <img src={logo} alt="Logo" className="w-40 h-40 object-contain" />
      </div>

      <div className="w-full max-w-sm p-6">
        <label className="block mb-2 text-gray-700 font-medium">
          Masukkan Nomor Ponsel
        </label>
        <input
          type="tel"
          placeholder="Cth 081234567890"
          className="w-full border border-gray-300 rounded-md p-3 mb-4 text-base focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={sendOtp}
          disabled={loading}
          className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-md transition duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Mengirim...' : 'Masuk'}
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
