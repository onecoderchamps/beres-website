import React, { useState, useEffect } from 'react';
import { getData, postData } from '../../api/service';
import { FaHandHoldingHeart } from 'react-icons/fa';
import BackButton from '../../component/BackButton';

const SedekahScreen = () => {
  const [loading, setLoading] = useState(true);
  const [rekening, setRekening] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    try {
      const transaksi = await getData('Sedekah');
      setHistory(transaksi.data.filter(item => item.type.includes('Sedekah')));
      setRekening(transaksi.totalSedekah);
      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Terjadi kesalahan saat memverifikasi.');
    }
  };

  const handleTransfer = async () => {
    const amount = parseInt(nominal);
    if (!amount || amount <= 0) {
      alert('Nominal harus diisi dengan angka lebih dari 0');
      return;
    }
    if (!keterangan.trim()) {
      alert('Keterangan tidak boleh kosong');
      return;
    }

    try {
      await postData('Transaksi/Sedekah', {
        nominal: amount,
        keterangan: keterangan.trim(),
      });
      getDatabase();
      setModalVisible(false);
      setNominal('');
      setKeterangan('');
      alert('Pembayaran berhasil.');
    } catch (err) {
      alert(err?.message || 'Transaksi gagal');
    }
  };

  const formatCurrency = (numberString) => {
    if (!numberString) return '';
    return parseInt(numberString).toLocaleString('id-ID');
  };

  const handleNominalChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setNominal(raw);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-white-100 p-4">
        <BackButton title={"Daftar Koperasi"} />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-800"></div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <FaHandHoldingHeart className="text-green-900 text-4xl mx-auto" />
            <h2 className="text-gray-600 text-lg mt-2">Total Sedekah</h2>
            <p className="text-green-900 text-3xl font-bold mt-1">Rp {rekening?.toLocaleString('id-ID')}</p>
          </div>

          <button
            className="w-full bg-green-900 text-white font-semibold py-3 rounded-xl mb-6"
            onClick={() => setModalVisible(true)}
          >
            Sedekah Sekarang
          </button>

          <h3 className="text-xl font-bold text-green-900 mb-4">Riwayat Sedekah</h3>
          <div className="space-y-4 pb-12">
            {history.map(item => (
              <div
                key={item.id}
                className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
                  item.status === 'Income' ? 'border-green-500' : 'border-red-500'
                } flex justify-between items-start`}
              >
                <div>
                  <p className="text-base font-medium text-gray-800">{item.ket}</p>
                  <p className="text-sm text-gray-500">{formatDateTime(item.createdAt)}</p>
                </div>
                <p className="text-base font-bold">
                  {item.status === 'Income' ? '+' : '-'} Rp {item.nominal.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-999999">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-green-900 mb-4">Sedekah</h2>
            <input
              type="text"
              placeholder="Nominal"
              value={formatCurrency(nominal)}
              onChange={handleNominalChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <input
              type="text"
              placeholder="Keterangan"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 text-gray-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleTransfer}
                className="px-4 py-2 bg-green-900 text-white rounded-md font-semibold"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SedekahScreen;
