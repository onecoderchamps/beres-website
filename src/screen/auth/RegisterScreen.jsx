import React, { useState, useEffect } from 'react';
import { getData, postData } from '../../api/service';
import BackButton from '../../component/BackButton'; // Ensure this path is correct

const RegisterScreen = ({ navigateToHome }) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [noNIK, setNoNIK] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isAgreedFee, setIsAgreedFee] = useState(false);
  const [rekening, setRekening] = useState(0); // Default to 0, will be updated by API

  useEffect(() => {
    const getDatabase = async () => {
      try {
        const response = await getData('rekening/SettingIuranTahunan');
        // Assuming response.data directly contains the number
        setRekening(response.data);
      } catch (error) {
        console.error("Error fetching annual fee setting:", error);
        alert(error?.response?.data?.message || "Terjadi kesalahan saat memuat biaya tahunan.");
        // Set a default or keep 0 if fetching fails
        setRekening(0);
      }
    };
    getDatabase();
  }, []);

  const handleRegister = async () => {
    if (!fullname.trim() || !address.trim() || !email.trim() || !noNIK.trim()) {
      alert('Semua field wajib diisi.');
      return;
    }
    if (!isAgreed || !isAgreedFee) {
      alert('Kamu harus menyetujui semua persyaratan terlebih dahulu.');
      return;
    }
    setLoading(true);
    try {
      const userData = { fullname, email, noNIK, address };
      await postData('auth/updateProfile', userData);
      alert('Pendaftaran berhasil.');
      // Use navigateToHome prop if provided, otherwise fallback to window.location.href
      if (navigateToHome) {
        navigateToHome();
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      // Improved error handling for the alert message
      const errorMessage = err?.response?.data?.message || err || "Terjadi kesalahan saat pendaftaran.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8">
        <BackButton title={"Daftar Koperasi"} />
        <div className="space-y-5">
          {/* Fullname */}
          <div>
            <label htmlFor="fullname" className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              id="fullname"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Masukkan nama lengkap Anda"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* No NIK */}
          <div>
            <label htmlFor="noNIK" className="block text-sm font-semibold text-gray-700 mb-1">No NIK</label>
            <input
              type="text"
              id="noNIK"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Contoh: 32xxxxxxxxxxxxxx"
              value={noNIK}
              onChange={(e) => setNoNIK(e.target.value)}
            />
          </div>

          {/* Alamat */}
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
            <textarea
              id="address"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
              placeholder="Masukkan alamat lengkap Anda"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          {/* Checkbox Persetujuan S&K */}
          <div className="flex items-start space-x-3 pt-2">
            <input
              type="checkbox"
              id="agree-terms"
              checked={isAgreed}
              onChange={() => setIsAgreed(!isAgreed)}
              className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
            />
            <label htmlFor="agree-terms" className="text-sm text-gray-700 cursor-pointer">
              Saya setuju dengan <a href="#" className="text-blue-600 hover:underline font-medium">Syarat & Ketentuan</a> yang berlaku.
            </label>
          </div>

          {/* Checkbox Persetujuan Biaya */}
          <div className="flex items-start space-x-3 mb-4">
            <input
              type="checkbox"
              id="agree-fee"
              checked={isAgreedFee}
              onChange={() => setIsAgreedFee(!isAgreedFee)}
              className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
            />
            <label htmlFor="agree-fee" className="text-sm text-gray-700 cursor-pointer">
              Saya setuju membayar uang keanggotaan koperasi sebesar{' '}
              <strong className="text-blue-700">Rp {rekening.toLocaleString('id-ID')}</strong> per tahun.
            </label>
          </div>

          <p className="text-sm italic text-gray-600 text-center mb-6">
            Dengan mendaftar, Anda secara otomatis akan melakukan pembayaran uang keanggotaan tahunan koperasi.
          </p>

          {/* Tombol Daftar */}
          <button
            onClick={handleRegister}
            disabled={loading || !isAgreed || !isAgreedFee}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-colors duration-300
                      ${loading || !isAgreed || !isAgreedFee
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      }`}
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;