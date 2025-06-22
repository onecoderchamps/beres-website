import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postData } from '../../api/service';
import BackButton from '../../component/BackButton'; // Pastikan path ini sesuai
import { HiOutlineShieldCheck, HiOutlineClock } from 'react-icons/hi'; // Contoh ikon untuk visual menarik
import { MdErrorOutline } from 'react-icons/md'; // Ikon untuk error

const OtpVerificationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Ambil nomor telepon dari state navigasi atau localStorage sebagai fallback
  const phonenumber = location.state?.phonenumber || localStorage.getItem('phonenumber');

  const [otp, setOtp] = useState(''); // Langsung pakai 'otp' saja
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState(''); // State untuk pesan error
  const [resendSuccess, setResendSuccess] = useState(false); // State untuk konfirmasi kirim ulang
  const intervalRef = useRef(null);

  useEffect(() => {
    // Redirect jika tidak ada nomor telepon
    if (!phonenumber) {
      navigate('/LoginScreen', { replace: true });
      return;
    }

    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [timer, phonenumber, navigate]); // Tambahkan dependensi navigasi

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Memastikan hanya angka yang bisa dimasukkan dan membatasi panjangnya (misal 6 digit)
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setError(''); // Hapus error saat pengguna mulai mengetik
    }
  };

  const verifyOtp = async () => {
    setError(''); // Bersihkan error sebelumnya
    if (!otp.trim() || otp.length !== 4) { // Validasi OTP harus 6 digit
      setError("Kode OTP harus 6 digit angka.");
      return;
    }

    setLoading(true);
    try {
      const formData = {
        phonenumber,
        code: otp
      };
      // Simulasi panggilan API (hapus di produksi)
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = await postData('otp/validateWA', formData); // Gunakan ini di produksi
      // const response = { message: { accessToken: "dummy_access_token_123" } }; // Simulasi respons
      localStorage.setItem('accessTokens', response.message.accessToken);
      setLoading(false);
      navigate('/HomeScreen'); // Navigasi ke halaman berikutnya
    } catch (err) {
      setLoading(false);
      const errorMessage = err?.response?.data?.message || "Terjadi kesalahan saat memverifikasi OTP. Coba lagi.";
      setError(errorMessage);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendSuccess(false); // Reset notifikasi sukses kirim ulang
    setLoading(true); // Tampilkan loading saat kirim ulang

    try {
      // Simulasi panggilan API (hapus di produksi)
      await new Promise(resolve => setTimeout(resolve, 1500));
      // await postData('otp/sendWA', { phonenumber }); // Gunakan ini di produksi

      setTimer(60); // Reset timer
      setResendSuccess(true); // Tampilkan notifikasi sukses
      setTimeout(() => setResendSuccess(false), 3000); // Sembunyikan setelah 3 detik
    } catch (err) {
      const errorMessage = err?.message || "Gagal mengirim ulang OTP. Mohon coba lagi.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Sembunyikan loading
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-4 font-sans antialiased">
      {/* Back button di bagian atas */}
      <div className="w-full max-w-md pt-4">
        <BackButton title="Verifikasi OTP" />
      </div>

      {/* Kontainer Utama Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-6 transform transition-all duration-300 ease-in-out border border-gray-100">

        <div className="flex justify-center mb-6">
          <HiOutlineShieldCheck className="w-20 h-20 text-yellow-500" />
        </div>

        <h1 className="text-2xl md:text-2xl font-extrabold text-gray-800 text-center mb-2 leading-tight">
          Kode Verifikasi
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
          Masukkan 6 digit kode yang kami kirim ke WhatsApp <br/>
          <span className="font-semibold text-gray-700">{phonenumber}</span>
        </p>

        {/* Input OTP */}
        <div className="mb-4">
          <label htmlFor="otpInput" className="sr-only">Masukkan OTP</label> {/* Untuk aksesibilitas */}
          <input
            type="tel" // Gunakan 'tel' untuk keyboard numerik di mobile
            id="otpInput"
            placeholder="— — — — — —" // Placeholder yang lebih baik
            maxLength="6"
            className={`w-full px-4 py-3 text-center border ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-yellow-500'
            } rounded-xl text-2xl font-bold tracking-widest text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:border-transparent transition duration-200 ease-in-out appearance-none`}
            value={otp}
            onChange={handleInputChange}
            disabled={loading}
            inputMode="numeric" // Pastikan keyboard numerik muncul
            pattern="[0-9]*" // Pastikan hanya angka
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center justify-center animate-fade-in">
              <MdErrorOutline className="mr-1" /> {error}
            </p>
          )}
        </div>

        {/* Timer & Kirim Ulang */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center text-gray-600">
            <HiOutlineClock className="mr-1" />
            <span className="font-semibold">{formatTime(timer)}</span>
          </div>
          <button
            onClick={handleResend}
            disabled={timer > 0 || loading}
            className={`font-medium transition duration-200 ease-in-out
              ${timer > 0 || loading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-yellow-600 hover:text-yellow-700 active:scale-95'
              }`}
          >
            {loading && resendSuccess === false ? 'Mengirim Ulang...' : 'Kirim Ulang'}
          </button>
        </div>

        {resendSuccess && (
          <p className="text-sm text-green-600 text-center mb-4 animate-fade-in-up">
            OTP berhasil dikirim ulang!
          </p>
        )}

        {/* Tombol Verifikasi */}
        <button
          onClick={verifyOtp}
          disabled={loading || otp.length !== 4} // Tombol disable jika OTP tidak 6 digit
          className={`w-full py-3 rounded-xl font-bold text-gray-900 shadow-md transition duration-300 ease-in-out transform
            ${loading || otp.length !== 6
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
              Memverifikasi...
            </div>
          ) : (
            'Verifikasi OTP'
          )}
        </button>
      </div>

      {/* Informasi Tambahan */}
      <p className="text-center text-xs text-gray-400 mt-6">
        Masalah? <a href="#" className="text-yellow-600 hover:text-yellow-700 underline font-medium">Hubungi Dukungan</a>
      </p>
    </div>
  );
};

export default OtpVerificationScreen;