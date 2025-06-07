import React, { useState, useEffect } from 'react';
import { getData, postData } from '../../api/service';
import BackButton from '../../component/BackButton';

const RegisterScreen = ({ navigateToHome }) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [noNIK, setNoNIK] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isAgreedFee, setIsAgreedFee] = useState(false);
  const [rekening, setRekening] = useState(0);

  useEffect(() => {
    const getDatabase = async () => {
      try {
        const rekening = await getData('rekening/SettingIuranTahunan');
        setRekening(rekening.data);
      } catch (error) {
        alert(error?.response?.data?.message || "Terjadi kesalahan saat memverifikasi.");
      }
    };
    getDatabase();
  }, []);

  const handleRegister = async () => {
    if (!fullname || !address || !email || !noNIK) {
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
      window.location.href = '/';
    } catch (err) {
      alert(err || "Transaksi Tahunan Selesai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackButton title={"Daftar Koperasi"} />
      <div className="max-w-md mx-auto space-y-4">
        <label className="block text-sm font-medium">Nama Lengkap</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Nama lengkap"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />

        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm font-medium">No NIK</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Masukkan No NIK"
          value={noNIK}
          onChange={(e) => setNoNIK(e.target.value)}
        />

        <label className="block text-sm font-medium">Alamat</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Masukkan Alamat"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={() => setIsAgreed(!isAgreed)}
          />
          <span>Saya setuju dengan <strong>Syarat & Ketentuan</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isAgreedFee}
            onChange={() => setIsAgreedFee(!isAgreedFee)}
          />
          <span>Saya setuju membayar uang koperasi sebesar <strong>Rp {rekening.toLocaleString('id')}</strong></span>
        </div>

        <p className="text-sm italic text-gray-600">
          Dengan mendaftar kamu sekalian membayar uang tahunan koperasi.
        </p>

        <button
          onClick={handleRegister}
          disabled={loading || !isAgreed || !isAgreedFee}
          className={`w-full py-2 rounded font-semibold ${loading || !isAgreed || !isAgreedFee ? 'bg-gray-300 text-gray-600' : 'bg-yellow-400 text-black'}`}
        >
          {loading ? 'Mendaftarkan...' : 'Daftar'}
        </button>
      </div>
    </div>
  );
};

export default RegisterScreen;
