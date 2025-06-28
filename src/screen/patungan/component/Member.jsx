import React, { useEffect, useState } from 'react';
import { getData, postData } from '../../../api/service';
import { CheckCircle, XCircle, TrendingUp, Users, History } from 'lucide-react';
import { FaSpinner } from 'react-icons/fa';

const Member = ({ data, getPatunganDatabase }) => {
  const bulanSekarang = new Date().toLocaleString('id-ID', { month: 'long' });
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch current user data (for role check)
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

  // Handle 'Approve' payment (for Admin/Role 2)
  const handleBayar = async (itemToApprove) => {
    if (!window.confirm(`Yakin ingin menyetujui pembayaran ${itemToApprove.name} untuk patungan ini?`)) {
      return;
    }

    const formData = {
      idTransaksi: data.id,
      idUser: itemToApprove?.idUser,
    };
    try {
      const response = await postData('Patungan/PayCompletePatungan', formData);
      alert(response.message || "Pembayaran berhasil disetujui!");
      getPatunganDatabase();
    } catch (error) {
      console.error("Error approving payment:", error);
      alert(error?.response?.data?.errorMessage?.Error || "Terjadi kesalahan saat menyetujui pembayaran.");
    }
  };

  // Dummy data for stock development overview (replace with actual data if available)
  const dummyStockOverviewData = {
    currentValuePerLot: data.targetPay * (1 + (parseFloat(data.kenaikan) / 100)), // Example: 5% increase from targetPay
    initialValuePerLot: data.targetPay,
    growthPercentage: parseInt(data.kenaikan), // Example growth
    lastUpdate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  // --- DUMMY DATA FOR STOCK PROCESS DEVELOPMENT LIST ---
  // You will need to replace this with actual historical data fetched from your API
  const dummyStockProcessList = [
    {
      date: new Date(2025, 5, 24).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      value: data.targetPay,
      change: 0,
      description: 'Nilai awal per lembar saham Patungan.',
      type: 'initial'
    },
  ];
  // --- END DUMMY DATA ---

  // Ensure data.memberPatungan is an array before mapping
  const members = Array.isArray(data.memberPatungan) ? data.memberPatungan : [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      {/* Stock Development Overview Section */}
      <h2 className="font-bold text-2xl text-gray-800 mb-5 border-b pb-3 border-gray-100 flex items-center">
        <TrendingUp className="w-6 h-6 mr-3 text-purple-600" /> Perkembangan Saham Umum
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg flex flex-col justify-between">
          <p className="text-sm text-blue-700 font-medium">Nilai Saat Ini per Lembar</p>
          <p className="text-xl font-bold text-blue-800 mt-1">
            Rp {dummyStockOverviewData.currentValuePerLot.toLocaleString('id-ID')}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg flex flex-col justify-between ${dummyStockOverviewData.growthPercentage < 0
              ? 'bg-red-50' // Red background if negative
              : dummyStockOverviewData.growthPercentage === 0
                ? 'bg-blue-50' // Blue background if zero
                : 'bg-green-50' // Green background if positive
            }`}
        >
          <p
            className={`text-sm font-medium ${dummyStockOverviewData.growthPercentage < 0
                ? 'text-red-700' // Red text if negative
                : dummyStockOverviewData.growthPercentage === 0
                  ? 'text-blue-700' // Blue text if zero
                  : 'text-green-700' // Green text if positive
              }`}
          >
            Pergerakan Saham
          </p>
          <p
            className={`text-xl font-bold mt-1 ${dummyStockOverviewData.growthPercentage < 0
                ? 'text-red-800' // Darker red text if negative
                : dummyStockOverviewData.growthPercentage === 0
                  ? 'text-blue-800' // Darker blue text if zero
                  : 'text-green-800' // Darker green text if positive
              }`}
          >
            {dummyStockOverviewData.growthPercentage > 0 ? "+" + dummyStockOverviewData.growthPercentage : dummyStockOverviewData.growthPercentage}%
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
          <p className="text-sm text-gray-600 font-medium">Nilai Awal per Lembar: Rp {dummyStockOverviewData.initialValuePerLot.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-600 mt-1">Update Terakhir: {dummyStockOverviewData.lastUpdate}</p>
          <p className="text-sm text-gray-500 mt-2 italic">
            *Data ini adalah estimasi perkembangan umum, nilai aktual dapat bervariasi.
          </p>
        </div>
      </div>

      {/* List Perkembangan Proses Saham
      <h2 className="font-bold text-2xl text-gray-800 mb-5 border-b pb-3 border-gray-100 flex items-center">
        <History className="w-6 h-6 mr-3 text-purple-600" /> Riwayat Perkembangan Nilai Saham
      </h2>
      {dummyStockProcessList.length === 0 ? (
        <div className="text-center py-10 text-gray-600 italic">
          Belum ada riwayat perkembangan nilai saham tersedia.
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {dummyStockProcessList.map((entry, index) => (
            <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4"
                   style={{
                     backgroundColor: entry.type === 'increase' ? '#dcfce7' : (entry.type === 'decrease' ? '#fee2e2' : '#e0e7ff')
                   }}>
                {entry.type === 'increase' && <TrendingUp className="w-5 h-5 text-green-600" />}
                {entry.type === 'decrease' && <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />}
                {entry.type === 'initial' && <Users className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{entry.date}</p>
                <p className="text-gray-600 text-sm mt-1">{entry.description}</p>
                <p className={`font-bold text-lg mt-1 ${entry.type === 'increase' ? 'text-green-700' : (entry.type === 'decrease' ? 'text-red-700' : 'text-blue-700')}`}>
                  Rp {entry.value.toLocaleString('id-ID')}
                  {entry.change !== 0 && (
                    <span className={`ml-2 text-sm ${entry.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({entry.change > 0 ? '+' : ''}{entry.change}%)
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )} */}

      {/* Member List Section */}
      <h2 className="font-bold text-2xl text-gray-800 mb-5 border-b pb-3 border-gray-100 flex items-center">
        <Users className="w-6 h-6 mr-3 text-purple-600" /> Daftar Anggota
      </h2>
      {loadingUser ? (
        <div className="flex justify-center py-10">
          <FaSpinner className="animate-spin text-purple-600 text-4xl" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-10 text-gray-600 italic">
          Belum ada anggota yang bergabung dalam Patungan ini.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Anggota</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Lembar Saham</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Harga Saham Saya Saat Ini</th> {/* New Column Header */}
                {/* Optional Column 1: Iuran Bulan Ini */}
                {/*
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Iuran Bulan Ini</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status Pembayaran</th>
                */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {members.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">{item.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">{item.jumlahLot}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-semibold text-green-700"> {/* New Column Data */}
                    Rp {(item.jumlahLot * dummyStockOverviewData.currentValuePerLot).toLocaleString('id-ID')}
                  </td>
                  {/* Optional Column 1: Iuran Bulan Ini */}
                  {/*
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    {item.isMonthPayed ? (
                      <div className="flex items-center justify-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" /> Lunas
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-red-600">
                        <XCircle className="w-5 h-5 mr-1" /> Belum Lunas
                      </div>
                    )}
                  </td>
                  */}
                  {/* Optional Column 2: Status Pembayaran / Approval */}
                  {/*
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    {item.isPayed ? (
                      <div className="flex items-center justify-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" /> Disetujui
                      </div>
                    ) : userData?.role === '2' ? (
                      <button
                        onClick={() => handleBayar(item)}
                        className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold
                                   hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Setujui
                      </button>
                    ) : (
                      <div className="flex items-center justify-center text-yellow-600">
                        <XCircle className="w-5 h-5 mr-1" /> Menunggu
                      </div>
                    )}
                  </td>
                  */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Member;