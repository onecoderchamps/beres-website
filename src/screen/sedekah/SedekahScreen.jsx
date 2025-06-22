import React, { useState, useEffect } from 'react';
import { getData, postData } from '../../api/service';
import { FaHandHoldingHeart } from 'react-icons/fa'; // Icon for charity/sedekah
import BackButton from '../../component/BackButton'; // Ensure this path is correct

const SedekahScreen = () => {
  const [loading, setLoading] = useState(true);
  const [totalSedekah, setTotalSedekah] = useState(0); // Changed 'rekening' to 'totalSedekah' for clarity
  const [modalVisible, setModalVisible] = useState(false);
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    setLoading(true); // Ensure loading is true when fetching
    try {
      const transaksi = await getData('Sedekah');
      // Assuming transaksi.data is the array of history items
      // And transaksi.totalSedekah is the aggregate sum
      setHistory(transaksi.data.filter(item => item.type.includes('Sedekah')));
      setTotalSedekah(transaksi.totalSedekah);
    } catch (error) {
      console.error("Error fetching sedekah data:", error); // Log error for debugging
      alert(error.response?.data?.message || 'Terjadi kesalahan saat memuat data sedekah.');
      setHistory([]); // Clear history on error
      setTotalSedekah(0); // Reset total on error
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    const amount = parseInt(nominal.replace(/\D/g, '')); // Ensure nominal is parsed correctly after stripping non-digits
    if (isNaN(amount) || amount <= 0) {
      alert('Nominal harus diisi dengan angka lebih dari 0.');
      return;
    }
    if (!keterangan.trim()) {
      alert('Keterangan tidak boleh kosong.');
      return;
    }

    try {
      // Show loading indicator within modal if desired, or disable button
      await postData('Transaksi/Sedekah', {
        nominal: amount,
        keterangan: keterangan.trim(),
      });
      // Refresh data after successful transaction
      await getDatabase();
      setModalVisible(false); // Close modal
      setNominal(''); // Clear input
      setKeterangan(''); // Clear input
      alert('Sedekah Anda berhasil dicatat. Terima kasih!'); // More encouraging message
    } catch (err) {
      console.error("Sedekah transaction failed:", err); // Log error for debugging
      alert(err?.response?.data?.message || err?.message || 'Transaksi sedekah gagal. Mohon coba lagi.');
    }
  };

  const formatCurrency = (number) => {
    if (typeof number !== 'number' || isNaN(number)) return '';
    return number.toLocaleString('id-ID');
  };

  const handleNominalChange = (e) => {
    const raw = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    setNominal(raw);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Use 24-hour format
    };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <div className="bg-white min-h-screen p-2"> {/* Soft background, padding-bottom for scrollable content */}
      <BackButton title={"Sedekah"} /> {/* Sticky header, BackButton component */}

      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]"> {/* Centered loading spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto p-4"> {/* Max width for content, centered */}

          {/* Total Sedekah Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-2xl shadow-xl p-6 mb-8 text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <FaHandHoldingHeart className="text-white text-5xl mx-auto mb-3 opacity-90" />
            <p className="text-sm font-light opacity-80">Total Sedekah Terkumpul</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold mt-1">
              Rp {formatCurrency(totalSedekah)}
            </h2>
            <p className="text-xs mt-2 opacity-70">Mari terus berlomba dalam kebaikan.</p>
          </div>

          {/* Sedekah Sekarang Button */}
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 mb-8 text-lg"
            onClick={() => setModalVisible(true)}
          >
            <FaHandHoldingHeart className="inline-block mr-2 text-xl" /> Sedekah Sekarang
          </button>

          {/* Riwayat Sedekah Section */}
          {/* <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b-2 border-gray-200 pb-2">Riwayat Sedekah Anda</h3>
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map(item => (
                <div
                  key={item.id}
                  className={`bg-white p-5 rounded-xl shadow-lg border-l-4 ${
                    item.status === 'Income' ? 'border-green-500' : 'border-red-500'
                  } flex flex-col sm:flex-row justify-between items-start sm:items-center transform hover:scale-[1.01] transition-transform duration-200 ease-in-out`}
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="text-base font-semibold text-gray-800 leading-tight">{item.ket || 'Tanpa Keterangan'}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDateTime(item.createdAt)}</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {item.status === 'Income' ? '+' : '-'} Rp {formatCurrency(item.nominal)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-10 text-lg">Belum ada riwayat sedekah. Mulai berdonasi sekarang!</p>
            )}
          </div> */}
        </div>
      )}

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform scale-95 animate-scale-in">
            <h2 className="text-2xl font-bold text-green-700 mb-5 text-center">Form Sedekah</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nominal (contoh: 100.000)"
                value={nominal ? `Rp ${formatCurrency(parseInt(nominal))}` : ''} // Format input as user types
                onChange={handleNominalChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200"
                inputMode="numeric" // Suggest numeric keyboard on mobile
                pattern="[0-9]*" // For better mobile keyboard support
              />
              <textarea
                placeholder="Keterangan (contoh: Untuk anak yatim)"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows="3" // Allow multiple lines for description
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200 resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalVisible(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleTransfer}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                Sedekah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SedekahScreen;