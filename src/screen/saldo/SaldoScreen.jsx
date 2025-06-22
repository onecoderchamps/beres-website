import React, { useState, useEffect } from 'react';
import { FaMoneyBill, FaWhatsapp } from 'react-icons/fa';
import { getData } from '../../api/service';
import BackButton from '../../component/BackButton';

const SaldoScreen = () => {
  const [loading, setLoading] = useState(true);
  const [saldo, setSaldo] = useState(1500000);
  const [history, setHistory] = useState([]);
  const [datas, setDatas] = useState({ balance: 0 });
  const [rekening, setRekening] = useState({ bank: '', holder: '', rekening: '' });

  const getDatabase = async () => {
    try {
      const response = await getData('/auth/verifySessions');
      const rekeningRes = await getData('/rekening');
      const transaksi = await getData('/transaksi');

      setDatas(response.data);
      setRekening(rekeningRes.data);
      setHistory(transaksi.data);
      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Terjadi kesalahan saat memverifikasi.');
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const openWhatsApp = () => {
    const phoneNumber = '628179861505';
    const message = 'Halo, saya ingin mengirim bukti topup';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white-100 p-4 relative">
        <BackButton title={"Saldo"} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Saldo Section */}
          <div className="flex items-center bg-green-50 p-4 rounded-xl shadow">
            <FaMoneyBill className="text-green-800 text-xl mr-2" />
            <span className="text-lg font-bold text-green-900">
              Rp {datas.balance.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Info Transfer Section */}
          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <InfoRow label="Bank" value={rekening.bank} />
            <InfoRow label="Holder" value={rekening.holder} />
            <InfoRow label="Nomor" value={rekening.rekening} />
            <p className="text-xs text-gray-500 mt-2">
              *Harap transfer ke nomor rekening di atas.
            </p>
            <p className="text-xs text-gray-500">
              *Setiap melakukan top up, harap kirim bukti pembayaran ke WhatsApp dengan mengklik tombol CS.
            </p>
          </div>

          {/* History Section */}
          <div>
            <h2 className="text-lg font-bold text-green-800 mb-2">Riwayat Transaksi</h2>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-800">{item.ket}</p>
                    <p className="text-sm text-gray-500">{formatDateTime(item.createdAt)}</p>
                  </div>
                  <p className={`font-bold ${item.status === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.status === 'Income' ? '+ ' : '- '}Rp {item.nominal.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center shadow-lg"
      >
        <FaWhatsapp className="mr-2" />
        CS
      </button>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

export default SaldoScreen;
