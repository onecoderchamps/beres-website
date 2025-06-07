import React, { useEffect, useState } from 'react';
import { MdSwapHoriz, MdAddCircleOutline } from 'react-icons/md';
import { getData, postData } from '../api/service';

const MembershipCard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ balance: 0 });
  const [showModal, setShowModal] = useState(false);
  const [tujuan, setTujuan] = useState('');
  const [nominal, setNominal] = useState('');

  const getDatabase = async () => {
    setLoading(true);
    try {
      const response = await getData('auth/verifySessions');
      setData(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Terjadi kesalahan saat memverifikasi OTP.");
    }
    setLoading(false);
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const formatCurrency = (numberString) => {
    if (!numberString) return '0';
    return parseInt(numberString).toLocaleString('id-ID');
  };

  const handleNominalChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setNominal(raw);
  };

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('08')) return '+62' + cleaned.slice(1);
    if (cleaned.startsWith('62')) return '+62' + cleaned.slice(2);
    if (cleaned.startsWith('8')) return '+62' + cleaned;
    if (cleaned.startsWith('628')) return '+' + cleaned;
    if (cleaned.startsWith('+628')) return cleaned;
    return '+62' + cleaned;
  };

  const handleTransfer = async () => {
    try {
      const formData = {
        phone: formatPhoneNumber(tujuan),
        balance: parseFloat(nominal),
      };
      await postData('user/Transfer', formData);
      alert(`Transfer ke ${tujuan} sebesar Rp ${formatCurrency(nominal)}`);
      setShowModal(false);
      setTujuan('');
      setNominal('');
    } catch (error) {
      alert(error || "Terjadi kesalahan.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 rounded-xl shadow-md p-4 mx-4 my-5">
      <div className="flex justify-between">
        <div className="flex-1 cursor-pointer" onClick={getDatabase}>
          <p className="text-gray-800 font-semibold">Saldo </p>
          <p className="text-black text-xl font-bold mt-2">Rp {formatCurrency(data.balance)}</p>
          <p className="text-xs font-semibold">Klik untuk update saldo</p>
        </div>

        <div className="flex-1 flex justify-end gap-3 items-end">
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setShowModal(true)}>
            <MdSwapHoriz size={24} />
            <span className="text-xs font-bold mt-1">Transfer</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={() => window.location.href='/SaldoScreen'}>
            <MdAddCircleOutline size={24} />
            <span className="text-xs font-bold mt-1">TopUp</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-999">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-bold text-center mb-4">Transfer Dana</h2>
            <input
              type="text"
              placeholder="Nomor Ponsel Tujuan"
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-3"
            />
            <input
              type="text"
              placeholder="Nominal"
              value={formatCurrency(nominal)}
              onChange={handleNominalChange}
              className="w-full border border-gray-300 rounded-md p-2 mb-3"
            />
            <div className="flex justify-between">
              <button
                onClick={handleTransfer}
                className="bg-green-800 text-white px-4 py-2 rounded-md"
              >
                Transfer
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipCard;