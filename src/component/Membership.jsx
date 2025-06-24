import React, { useEffect, useState } from 'react';
import { MdSwapHoriz, MdAddCircleOutline, MdClose, MdPhone, MdAttachMoney, MdCheckCircle } from 'react-icons/md'; // Added new icons
import { getData, postData } from '../api/service';

const MembershipCard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ balance: 0 }); // Default balance to 0
  const [showModal, setShowModal] = useState(false);
  const [tujuan, setTujuan] = useState('');
  const [nominal, setNominal] = useState('');
  const [modalLoading, setModalLoading] = useState(false); // Loading state for modal actions
  const [modalError, setModalError] = useState(''); // Error state for modal
  const [transferSuccess, setTransferSuccess] = useState(false); // Success state for transfer

  // Function to fetch balance
  const getBalance = async () => { // Renamed from getDatabase for clarity
    setLoading(true);
    try {
      // Simulate API call for balance update
      // await new Promise(resolve => setTimeout(resolve, 500));
      const response = await getData('auth/verifySessions'); // Assuming this endpoint gives user balance
      setData(response.data);
      setModalError(''); // Clear error on successful refresh
    } catch (error) {
      console.error("Error fetching balance:", error);
      // More user-friendly error for fetching balance
      // alert(error.response?.data?.message || "Gagal memuat saldo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  const formatCurrency = (numberString) => {
    // Ensure input is treated as a number
    const number = typeof numberString === 'string' ? parseInt(numberString.replace(/\D/g, ''), 10) : numberString;
    if (isNaN(number)) return '0'; // Handle invalid input
    return number.toLocaleString('id-ID');
  };

  const handleNominalChange = (e) => {
    const raw = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setNominal(raw);
    setModalError(''); // Clear error on input change
  };

  // Improved formatPhoneNumber for robustness
  const formatPhoneNumber = (number) => {
    if (!number) return '';
    let cleaned = number.replace(/[^0-9]/g, ''); // Remove non-digits

    if (cleaned.startsWith('08')) {
      cleaned = '62' + cleaned.slice(1);
    } else if (cleaned.startsWith('+62')) {
      cleaned = cleaned.slice(1); // Remove '+'
    } else if (cleaned.startsWith('62')) {
      // Already correct, no change needed
    } else if (cleaned.startsWith('8')) {
      cleaned = '62' + cleaned;
    }
    // Add '+' prefix only if it's a valid 62... number
    return cleaned.startsWith('62') ? '+' + cleaned : cleaned;
  };

  const handleTransfer = async () => {
    setModalError(''); // Clear previous errors
    setTransferSuccess(false); // Reset success state

    if (!tujuan.trim()) {
      setModalError("Nomor ponsel tujuan tidak boleh kosong.");
      return;
    }
    if (!nominal.trim() || parseFloat(nominal) <= 0) {
      setModalError("Nominal transfer tidak valid.");
      return;
    }
    if (parseFloat(nominal) > data.balance) {
      setModalError("Saldo tidak mencukupi untuk transfer ini.");
      return;
    }

    const formattedPhone = formatPhoneNumber(tujuan);
    if (!formattedPhone.startsWith('+62') || formattedPhone.length < 10) {
      setModalError("Format nomor ponsel tujuan tidak valid. Gunakan format 08xx atau +628xx.");
      return;
    }

    setModalLoading(true);
    try {
      const formData = {
        phone: formattedPhone,
        balance: parseFloat(nominal),
      };
      // Simulate API call for transfer
      // await new Promise(resolve => setTimeout(resolve, 1500));
      await postData('user/Transfer', formData); // Use this in production

      setTransferSuccess(true);
      // Optionally, fetch balance again after successful transfer
      await getBalance(); // Refresh balance after successful transfer
      setTujuan('');
      setNominal('');
      setTimeout(() => setShowModal(false), 2000); // Close modal after 2 seconds on success
    } catch (error) {
      console.error("Transfer error:", error);
      setModalError(error || "Terjadi kesalahan saat transfer.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between">
        {/* Saldo Section */}
        <div className="flex-1 cursor-pointer select-none" onClick={getBalance}>
          <p className="text-gray-600 text-sm font-medium">Saldo Tersedia</p>
          {loading ? (
            <p className="text-black text-2xl font-bold mt-2 animate-pulse">Rp ...</p>
          ) : (
            <p className="text-black text-2xl font-bold mt-2">Rp {formatCurrency(data.balance)}</p>
          )}
          <p className="text-yellow-600 text-xs font-semibold mt-1 hover:underline">
            Klik untuk update saldo
          </p>
        </div>

        {/* Actions Section */}
        <div className="flex justify-end gap-5"> {/* Increased gap */}
          <div
            className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-yellow-600 transition-colors duration-200 group"
            onClick={() => { setShowModal(true); setModalError(''); setTujuan(''); setNominal(''); setTransferSuccess(false); }} // Reset modal state
          >
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-yellow-100 transition-colors duration-200">
              <MdSwapHoriz size={24} className="text-gray-600 group-hover:text-yellow-700" />
            </div>
            <span className="text-xs font-semibold mt-2 group-hover:text-yellow-700">Transfer</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-yellow-600 transition-colors duration-200 group"
            onClick={() => window.location.href='/SaldoScreen'}
          >
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-yellow-100 transition-colors duration-200">
              <MdAddCircleOutline size={24} className="text-gray-600 group-hover:text-yellow-700" />
            </div>
            <span className="text-xs font-semibold mt-2 group-hover:text-yellow-700">Top Up</span>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-[100]"> {/* Higher z-index */}
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl relative animate-scale-in"> {/* Enhanced modal styling */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <MdClose size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Transfer Dana</h2>

            {transferSuccess ? (
              <div className="flex flex-col items-center text-green-600 py-6">
                <MdCheckCircle size={50} className="mb-3 animate-bounce-in" />
                <p className="text-lg font-semibold">Transfer Berhasil!</p>
                <p className="text-sm text-gray-600 mt-2 text-center">Dana sebesar Rp {formatCurrency(nominal)} berhasil ditransfer ke {tujuan}.</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="tujuanPhone" className="sr-only">Nomor Ponsel Tujuan</label>
                  <div className="relative">
                    <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel" // Use type="tel" for mobile numeric keyboard
                      id="tujuanPhone"
                      placeholder="Nomor Ponsel Tujuan"
                      value={tujuan}
                      onChange={(e) => { setTujuan(e.target.value); setModalError(''); }}
                      className={`w-full pl-10 pr-3 py-3 border ${
                        modalError ? 'border-red-500' : 'border-gray-300 focus:border-yellow-500'
                      } rounded-lg text-base outline-none focus:ring-1 focus:ring-yellow-500 transition duration-200`}
                      disabled={modalLoading}
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="nominalTransfer" className="sr-only">Nominal</label>
                  <div className="relative">
                    <MdAttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text" // Keep as text to allow currency formatting
                      id="nominalTransfer"
                      placeholder="Nominal Transfer"
                      value={formatCurrency(nominal)}
                      onChange={handleNominalChange}
                      className={`w-full pl-10 pr-3 py-3 border ${
                        modalError ? 'border-red-500' : 'border-gray-300 focus:border-yellow-500'
                      } rounded-lg text-base outline-none focus:ring-1 focus:ring-yellow-500 transition duration-200`}
                      disabled={modalLoading}
                      inputMode="decimal" // Suggest decimal keyboard
                    />
                  </div>
                  {modalError && (
                    <p className="text-red-600 text-sm mt-2 text-center animate-fade-in">{modalError}</p>
                  )}
                </div>

                <div className="flex justify-between gap-3">
                  <button
                    onClick={handleTransfer}
                    disabled={modalLoading || !tujuan.trim() || !nominal.trim() || parseFloat(nominal) <= 0}
                    className={`flex-1 py-3 rounded-lg font-semibold text-white transition duration-300 ease-in-out transform ${
                      modalLoading || !tujuan.trim() || !nominal.trim() || parseFloat(nominal) <= 0
                        ? 'bg-red-500 cursor-not-allowed opacity-75'
                        : 'bg-red-500 hover:bg-red-600 active:scale-98 shadow-md'
                    }`}
                  >
                    {modalLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mentransfer...
                      </div>
                    ) : (
                      'Transfer'
                    )}
                  </button>
                  <button
                    onClick={() => { setShowModal(false); setModalError(''); setTujuan(''); setNominal(''); setTransferSuccess(false); }}
                    disabled={modalLoading}
                    className={`flex-1 py-3 rounded-lg font-semibold text-gray-700 border border-gray-300 transition duration-300 ease-in-out transform ${
                      modalLoading ? 'bg-gray-200 cursor-not-allowed opacity-75' : 'bg-white hover:bg-gray-100 active:scale-98 shadow-sm'
                    }`}
                  >
                    Batal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipCard;