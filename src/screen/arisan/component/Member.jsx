import React, { useEffect, useState } from 'react';
import { getData, postData } from '../../../api/service';
import { CheckCircle, XCircle, Users, TrendingUp, History, Gift, Image as ImageIcon } from 'lucide-react'; // Added ImageIcon
import { FaSpinner } from 'react-icons/fa'; // For loading spinner

const Member = ({ data, getArisanDatabase }) => {
  const bulanSekarang = new Date().toLocaleString('id-ID', { month: 'long' });
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // Loading state for user data
  const [modalPayment, setModalPayment] = useState(false);
  const [detailMember, setDetailMember] = useState(null);

  // State untuk modal foto profil
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);


  // Fetch current user data (for role check and balance)
  const getDatabase = async () => {
    setLoadingUser(true);
    try {
      const response = await getData('auth/verifySessions');
      setUserData(response.data);
    } catch (error) {
      console.error("Error verifying user session:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  // Handle opening the payment modal for a specific member
  const handleBayar = (itemToPay) => {
    setModalPayment(true);
    setDetailMember(itemToPay); // Set the specific member data for the modal
  };

  // Handle the actual payment submission
  const handlePay = async () => {
    if (!detailMember || !userData) {
      alert('Data tidak lengkap untuk pembayaran. Harap coba lagi.');
      return;
    }

    // Calculate total iuran for the current user's lots
    const userCurrentLots = data.memberArisan.filter((member) => member.idUser === userData.phone).length;
    const totalIuranNeeded = data.targetPay * userCurrentLots;

    if (userData.balance < totalIuranNeeded) {
      alert('Saldo Anda tidak mencukupi untuk pembayaran iuran ini.');
      return;
    }

    try {
      await postData('Arisan/PayArisan', { idTransaksi: data.id });
      alert('Pembayaran iuran berhasil!');
      getArisanDatabase(); // Refresh parent component data
      setModalPayment(false);
      setDetailMember(null); // Clear detailMember after payment
    } catch (err) {
      console.error("Error paying arisan:", err);
      alert(err?.response?.data?.message || 'Gagal melakukan pembayaran iuran.');
    }
  };

  // Function to open the fullscreen profile image modal
  const openProfileImageModal = (imageUri) => {
    setSelectedProfileImage(imageUri);
    setModalImageVisible(true);
  };

  // Function to close the fullscreen profile image modal
  const closeProfileImageModal = () => {
    setModalImageVisible(false);
    setSelectedProfileImage(null);
  };

  // Ensure data.memberArisan is an array before mapping
  const members = Array.isArray(data.memberArisan) ? data.memberArisan : [];

  // --- DUMMY DATA FOR GOLD HISTORY ---
  // You MUST replace this with actual historical gold price data from your API.
  const dummyGoldHistory = [
    {
      date: new Date(2024, 0, 1).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      pricePerGram: 900000,
      description: 'Harga emas awal tahun 2024.',
      type: 'initial'
    },
    {
      date: new Date(2024, 2, 15).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      pricePerGram: 950000,
      description: 'Kenaikan harga emas setelah pengumuman kebijakan moneter.',
      type: 'increase'
    }
  ];
  // --- END DUMMY DATA ---

  // --- DUMMY DATA FOR RECIPIENT HISTORY ---
  // You MUST replace this with actual recipient history data from your API.
  const dummyRecipientHistory = [
    {
      date: new Date(2024, 4, 5).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipientName: 'Dewi Lestari',
      profilePicture: 'https://apiberes.coderchamps.co.id/api/v1/file/review/6852ed9e692de1f78365b8dc', // Placeholder image
      amountReceived: data.totalPrice || 50000000,
      month: 4
    },
    {
      date: new Date(2024, 5, 5).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipientName: 'Wayan Putra',
      profilePicture: 'https://apiberes.coderchamps.co.id/api/v1/file/review/6852ed9e692de1f78365b8dc', // Placeholder image
      amountReceived: data.totalPrice || 50000000,
      month: 5
    },
  ];
  // --- END DUMMY DATA ---


  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6"> {/* Main card container */}

      {/* Member List Section */}
      <h2 className="font-bold text-2xl text-gray-800 mb-5 border-b pb-3 border-gray-100 flex items-center">
        <Users className="w-6 h-6 mr-3 text-purple-600" /> Daftar Anggota Arisan
      </h2>
      {loadingUser ? (
        <div className="flex justify-center py-10">
          <FaSpinner className="animate-spin text-purple-600 text-4xl" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-10 text-gray-600 italic">
          Belum ada anggota yang bergabung dalam Arisan ini.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Slot</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Iuran {bulanSekarang}</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status Terima</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {members.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">{item.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">{item.jumlahLot}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    {item.isMonthPayed ? (
                      <div className="flex items-center justify-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" /> Lunas
                      </div>
                    ) : (
                      item.idUser === userData?.phone ? (
                        <button
                          onClick={() => handleBayar(item)}
                          className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold
                                     hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                          Bayar
                        </button>
                      ) : (
                        <div className="flex items-center justify-center text-red-600">
                          <XCircle className="w-5 h-5 mr-1" /> Belum Lunas
                        </div>
                      )
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    {item.isPayed ? (
                      <div className="flex items-center justify-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" /> Diterima
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-gray-500">
                        <XCircle className="w-5 h-5 mr-1" /> Belum
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Perkembangan Riwayat Emas Section */}
      {/* <h2 className="font-bold text-2xl text-gray-800 mb-5 border-b pb-3 border-gray-100 flex items-center">
        <History className="w-6 h-6 mr-3 text-yellow-600" /> Perkembangan Riwayat Emas
      </h2>
      {dummyGoldHistory.length === 0 ? (
        <div className="text-center py-10 text-gray-600 italic">
          Belum ada riwayat perkembangan harga emas tersedia.
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {dummyGoldHistory.map((entry, index) => {
            const previousPrice = index > 0 ? dummyGoldHistory[index - 1].pricePerGram : entry.pricePerGram;
            const change = entry.pricePerGram - previousPrice;
            const percentageChange = (change / previousPrice) * 100;

            let icon, bgColor, textColor, changeArrow;
            if (entry.type === 'initial') {
              icon = <History className="w-5 h-5 text-blue-600" />;
              bgColor = '#e0e7ff'; // blue-100
              textColor = 'text-blue-700';
            } else if (change > 0) {
              icon = <TrendingUp className="w-5 h-5 text-green-600" />;
              bgColor = '#dcfce7'; // green-100
              textColor = 'text-green-700';
              changeArrow = '▲';
            } else if (change < 0) {
              icon = <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />; // Down arrow
              bgColor = '#fee2e2'; // red-100
              textColor = 'text-red-700';
              changeArrow = '▼';
            } else {
              icon = <TrendingUp className="w-5 h-5 text-gray-600" />;
              bgColor = '#f3f4f6'; // gray-100
              textColor = 'text-gray-700';
              changeArrow = '-';
            }

            return (
              <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4"
                     style={{ backgroundColor: bgColor }}>
                  {icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{entry.date}</p>
                  <p className="text-gray-600 text-sm mt-1">{entry.description}</p>
                  <p className={`font-bold text-lg mt-1 ${textColor}`}>
                    Rp {entry.pricePerGram.toLocaleString('id-ID')} / gram
                    {change !== 0 && (
                      <span className={`ml-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({changeArrow} {Math.abs(percentageChange).toFixed(2)}%)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
          <p className="text-sm text-gray-500 italic text-center pt-4">
            *Data riwayat emas adalah harga umum pasar dan dapat bervariasi dari sumber yang berbeda.
          </p>
        </div> */}
      {/* )} */}

      {/* --- SECTION: Riwayat Penerima Arisan (Dengan Foto Profil Dapat Diklik) --- */}
      {/* <h2 className="font-bold text-2xl text-gray-800 mb-5 border-b pb-3 border-gray-100 flex items-center">
        <Gift className="w-6 h-6 mr-3 text-indigo-600" /> Riwayat Penerima Arisan
      </h2>
      {dummyRecipientHistory.length === 0 ? (
        <div className="text-center py-10 text-gray-600 italic">
          Belum ada riwayat penerima arisan.
        </div>
      ) : (
        <div className="space-y-4">
          {dummyRecipientHistory.map((entry, index) => (
            <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden mr-4 cursor-pointer relative group"
                   onClick={() => openProfileImageModal(entry.profilePicture)}>
                <img
                  src={entry.profilePicture}
                  alt={entry.recipientName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150/CCCCCC/808080?text=No+Image" }} // Fallback image on error
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{entry.date}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Penerima Bulan ke-{entry.month}: <span className="font-medium text-gray-800">{entry.recipientName}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )} */}
      {/* --- END SECTION --- */}


      {/* Bayar Iuran Modal */}
      {modalPayment && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] transform scale-95 animate-scale-in">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-purple-700">Konfirmasi Pembayaran Iuran</h2>
              <button onClick={() => setModalPayment(false)} className="text-gray-500 hover:text-gray-700 transition">
                <XCircle className="text-2xl" />
              </button>
            </div>

            {userData ? (
              <>
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700 text-base">
                    <strong>Saldo Anda:</strong> <br />
                    <span className="text-purple-600 font-bold text-xl">
                      Rp {userData?.balance?.toLocaleString('id-ID') || '0'}
                    </span>
                  </p>
                  <p className="text-gray-700 text-base">
                    <strong>Jumlah Slot Anda:</strong> <br />
                    <span className="text-blue-600 font-bold text-xl">
                      {data.memberArisan.filter((item) => item.idUser === userData.phone).length}
                    </span>
                  </p>
                  <p className="text-gray-700 text-base">
                    <strong>Total Iuran Bulan Ini:</strong> <br />
                    <span className="text-green-600 font-bold text-xl">
                      Rp {(data?.targetPay * data.memberArisan.filter((item) => item.idUser === userData.phone).length).toLocaleString('id-ID')}
                    </span>
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setModalPayment(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handlePay}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                  >
                    Bayar Sekarang
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-600">Memuat data pengguna...</div>
            )}
          </div>
        </div>
      )}

      {/* Modal Gambar Profil Fullscreen */}
      {modalImageVisible && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={closeProfileImageModal}
        >
          <button
            onClick={closeProfileImageModal}
            className="absolute top-4 right-4 text-white text-4xl p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition z-50"
          >
            <XCircle className="w-8 h-8" />
          </button>
          <img
            src={selectedProfileImage}
            alt="Foto Profil Fullscreen"
            className="max-w-full max-h-full object-contain cursor-zoom-out"
            onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/600/CCCCCC/808080?text=Gambar+Tidak+Tersedia" }} // Fallback for fullscreen
          />
        </div>
      )}
    </div>
  );
};

export default Member;