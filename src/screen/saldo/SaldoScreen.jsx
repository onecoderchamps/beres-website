import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaMoneyBill, FaWhatsapp, FaUpload, FaTimesCircle, FaPlusCircle, FaEye, FaExclamationCircle, FaTrash } from 'react-icons/fa'; // Added FaTrash
import { getData, putData, postData, deleteData } from '../../api/service'; // Added deleteData
import BackButton from '../../component/BackButton';

const SaldoScreen = () => {
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({ balance: 0 });
  const [rekening, setRekening] = useState({ bank: '', holder: '', rekening: '' });
  const [history, setHistory] = useState([]);
  const [saldoOrder, setSaldoOrder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isUploadingModalOpen, setIsUploadingModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false); // New state for cancellation loading

  const fileInputRef = useRef(null);

  const getDatabase = useCallback(async () => {
    try {
      setLoading(true);
      const [response, rekeningRes, transaksi, orderSaldoRes] = await Promise.all([
        getData('/auth/verifySessions'),
        getData('/rekening'),
        getData('/transaksi'),
        getData('Order/Saldo')
      ]);

      setDatas(response.data);
      setRekening(rekeningRes.data);
      setHistory(transaksi.data);

      if (orderSaldoRes.data && orderSaldoRes.data.status === 'Pending') {
        setSaldoOrder(orderSaldoRes.data);
        if (orderSaldoRes.data.image && orderSaldoRes.data.image !== 'null') {
          setUploadedImageUrl(orderSaldoRes.data.image);
        } else {
          setUploadedImageUrl('');
        }
        setSelectedFile(null);
      } else {
        setSaldoOrder(null);
        setUploadedImageUrl('');
        setSelectedFile(null);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      if (error.response?.status !== 404) {
        alert(error.response?.data?.message || 'Terjadi kesalahan saat memuat data.');
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getDatabase();
  }, [getDatabase]);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
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
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return 'Invalid Date';
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = '6281310531713';
    const message = 'Halo, saya ingin mengirim bukti topup';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadedImageUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setUploadedImageUrl('');
    }
  };

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await postData('/file/upload', formData, true);
    if (uploadRes.status && uploadRes.path) {
      return uploadRes.path;
    } else {
      throw new Error(uploadRes.message || 'Gagal mengunggah file.');
    }
  };

  const handleUploadProof = async () => {
    if (!saldoOrder || !saldoOrder.id) {
      alert('Tidak ada order saldo yang aktif untuk diupdate.');
      return;
    }

    if (!selectedFile && (!uploadedImageUrl || uploadedImageUrl === 'null')) {
      alert('Harap pilih gambar untuk diunggah.');
      return;
    }

    setUploadingImage(true);
    let imageUrlToSave = uploadedImageUrl;

    try {
      if (selectedFile) {
        imageUrlToSave = await uploadFileToServer(selectedFile);
      }

      const payload = {
        id: saldoOrder.id,
        status: "Pending",
        image: imageUrlToSave,
      };

      await putData("Order/Saldo", payload);
      alert('Bukti transfer berhasil diunggah! Harap tunggu konfirmasi.');
      setIsUploadingModalOpen(false);
      getDatabase();
    } catch (error) {
      console.error('Error uploading proof:', error);
      alert('Gagal mengunggah bukti transfer: ' + (error.message || 'Terjadi kesalahan tidak dikenal.'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTopUpAmountChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setTopUpAmount(formattedValue);
  };

  const handleCreateTopUpOrder = async () => {
    const amountToSend = Number(topUpAmount.replace(/\./g, ''));

    if (isNaN(amountToSend) || amountToSend <= 0) {
      alert('Harap masukkan jumlah top up yang valid (angka positif).');
      return;
    }

    setIsCreatingOrder(true);
    try {
      const payload = {
        price: amountToSend,
        image: null
      };
      await postData("Order/Saldo", payload);
      alert('Permintaan top up berhasil dibuat! Silakan unggah bukti transfer.');
      setIsTopUpModalOpen(false);
      setTopUpAmount('');
      getDatabase();
    } catch (error) {
      console.error('Error creating top up order:', error);
      alert('Gagal membuat permintaan top up: ' + (error.response?.data?.message || error.message || 'Terjadi kesalahan tidak dikenal.'));
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCancelTopUp = async () => {
    if (!saldoOrder || !saldoOrder.id) {
      alert('Tidak ada permintaan top up yang aktif untuk dibatalkan.');
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin membatalkan permintaan top up ini? Tindakan ini tidak bisa dibatalkan.")) {
      setIsCancellingOrder(true);
      try {
        await deleteData(`Order/${saldoOrder.id}`);
        alert('Permintaan top up berhasil dibatalkan.');
        getDatabase(); // Refresh data to remove the cancelled order
      } catch (error) {
        console.error('Error cancelling top up order:', error);
        alert('Gagal membatalkan permintaan top up: ' + (error.response?.data?.message || error.message || 'Terjadi kesalahan tidak dikenal.'));
      } finally {
        setIsCancellingOrder(false);
      }
    }
  };

  const totalTransferAmount = saldoOrder ? saldoOrder.price + saldoOrder.uniqueCode : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
        <BackButton title={"Saldo"} />
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="space-y-6 pt-4">
          {/* Saldo Section */}
          <div className="flex items-center bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <FaMoneyBill className="text-white text-3xl mr-4" />
            <div>
              <p className="text-white text-sm opacity-90">Saldo Anda</p>
              <span className="text-white text-3xl font-extrabold">
                Rp {datas.balance.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Conditional Display for Combined Order Info OR Top Up Button */}
          {saldoOrder ? (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Detail Top Up Anda</h3>

                {/* Total Transfer Amount */}
                <div className="flex flex-col items-start bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-700">Jumlah yang Harus Ditransfer:</p>
                    <div className="flex items-baseline justify-between w-full">
                        <span className="text-3xl font-extrabold text-blue-800">
                            Rp {totalTransferAmount.toLocaleString('id-ID')}
                        </span>
                    </div>
                     <p className="text-xs text-blue-600 mt-2 flex items-center">
                        <FaExclamationCircle className="mr-1 text-base" /> Harap transfer **tepat sebesar jumlah ini** agar mudah terverifikasi otomatis.
                    </p>
                </div>

                {/* Rekening Tujuan Info */}
                <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">Transfer ke Rekening Ini:</h4>
                    <InfoRow label="Bank" value={rekening.bank || 'N/A'} />
                    <InfoRow label="Atas Nama" value={rekening.holder || 'N/A'} />
                    <InfoRow label="Nomor Rekening" value={rekening.rekening || 'N/A'} />
                    <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                        Setelah transfer berhasil, segera **unggah bukti pembayaran** Anda. Verifikasi top up memerlukan waktu dan akan diproses secara manual.
                    </p>
                </div>

                {/* Upload Proof / View Proof Section */}
                {saldoOrder.status === 'Pending' && (
                    <div className="pt-4 border-t border-gray-100">
                        {saldoOrder.image && saldoOrder.image !== 'null' ? (
                            <div className="mt-4 text-center">
                                <p className="text-gray-700 text-sm mb-2 font-semibold">Bukti transfer Anda sudah diunggah:</p>
                                <img
                                    src={saldoOrder.image}
                                    alt="Bukti Transfer"
                                    className="w-full max-h-48 object-contain rounded-lg border border-gray-300 mx-auto shadow-sm cursor-pointer"
                                    onClick={() => setIsImageViewerOpen(true)}
                                />
                                {/* The 'Ganti Bukti Transfer' button is now inside the modal accessible via 'Unggah Bukti Transfer Sekarang' */}
                                <p className="text-xs text-gray-500 mt-2">Menunggu konfirmasi admin.</p>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <p className="text-gray-700 text-sm mb-2 font-semibold">Belum unggah bukti transfer?</p>
                                <button
                                    onClick={() => setIsUploadingModalOpen(true)}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 shadow-md"
                                >
                                    <FaUpload className="mr-2" /> Unggah Bukti Transfer Sekarang
                                </button>
                                <p className="text-xs text-gray-500 mt-2">Proses top up akan diverifikasi setelah bukti diunggah.</p>
                            </div>
                        )}

                        {/* Cancel Top Up Button */}
                        <div className="mt-5 text-center">
                            <button
                                onClick={handleCancelTopUp}
                                className="w-full max-w-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center mx-auto transition duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isCancellingOrder}
                            >
                                {isCancellingOrder ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Membatalkan...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="mr-2" /> Batalkan Top Up
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-red-500 mt-2">Membatalkan top up akan menghapus permintaan ini.</p>
                        </div>
                    </div>
                )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                <p className="text-gray-700 mb-4 text-lg">Anda belum memiliki permintaan top up yang aktif.</p>
                <button
                    onClick={() => setIsTopUpModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center mx-auto transition duration-300 shadow-md"
                >
                    <FaPlusCircle className="mr-2" /> Ajukan Top Up Saldo Baru
                </button>
            </div>
          )}

          {/* History Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Transaksi</h2>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-gray-900">{item.ket}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDateTime(item.createdAt)}</p>
                    </div>
                    <p className={`font-extrabold text-lg ${item.status === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.status === 'Income' ? '+ ' : '- '}Rp {item.nominal.toLocaleString('id-ID')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Belum ada riwayat transaksi.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Button CS */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full flex items-center shadow-lg transform hover:scale-105 transition-transform duration-300 z-40"
      >
        <FaWhatsapp className="text-xl mr-2" />
        CS
      </button>

      {/* Upload Image Modal */}
      {isUploadingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform scale-95 animate-scale-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Unggah Bukti Transfer</h3>
            <div className="space-y-5">
              <p className="text-gray-600">
                Silakan unggah tangkapan layar bukti transfer Anda. Pastikan gambar jelas dan terlihat semua detailnya.
              </p>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {/* Custom button to trigger file input */}
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-200 transition duration-200 flex items-center justify-center font-medium"
              >
                <FaUpload className="mr-2" /> Pilih Gambar dari Galeri
              </button>

              {/* Image Preview */}
              {uploadedImageUrl && (
                <div className="mt-4 relative group">
                  <img src={uploadedImageUrl} alt="Bukti Transfer Preview" className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-300 shadow-sm" />
                  <button
                    onClick={() => {
                        setUploadedImageUrl('');
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity duration-200"
                    title="Hapus gambar"
                  >
                    <FaTimesCircle />
                  </button>
                </div>
              )}

            </div>
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => {
                    setIsUploadingModalOpen(false);
                    setSelectedFile(null);
                    setUploadedImageUrl(saldoOrder?.image || '');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleUploadProof}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploadingImage || (!selectedFile && (!uploadedImageUrl || uploadedImageUrl === 'null'))}
              >
                {uploadingImage ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengunggah...
                  </>
                ) : (
                  'Unggah Bukti'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm transform scale-95 animate-scale-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Ajukan Top Up Saldo</h3>
            <div className="space-y-5">
              <p className="text-gray-600">
                Masukkan jumlah saldo yang ingin Anda top up.
              </p>
              <div>
                <label htmlFor="topUpAmount" className="text-sm font-medium text-gray-700 block mb-1">Jumlah Top Up (Rp)</label>
                <input
                  type="text"
                  id="topUpAmount"
                  value={topUpAmount}
                  onChange={handleTopUpAmountChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Contoh: 50.000"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => {
                    setIsTopUpModalOpen(false);
                    setTopUpAmount('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleCreateTopUpOrder}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreatingOrder || topUpAmount === '' || Number(topUpAmount.replace(/\./g, '')) <= 0}
              >
                {isCreatingOrder ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Membuat Order...
                  </>
                ) : (
                  'Buat Order Top Up'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {isImageViewerOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl h-auto max-h-[90vh] flex items-center justify-center">
            <img src={saldoOrder?.image} alt="Bukti Transfer" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
            <button
              onClick={() => setIsImageViewerOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/75 rounded-full p-2 text-2xl"
              title="Tutup"
            >
              <FaTimesCircle />
            </button>
          </div>
        </div>
      )}

      {/* Custom Styles for Animations (recommend moving to global CSS) */}
      <style jsx>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-in {
            animation: scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-b-0">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

export default SaldoScreen;